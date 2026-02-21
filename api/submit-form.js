import mailchimp from '@mailchimp/mailchimp_marketing';
import crypto from 'crypto';

// Vercel handles environment variables automatically if set in the dashboard
// But we can locally test if .env is present (though 'dotenv' is usually not needed in Vercel function runtime)
// If you run locally with `vercel dev`, it handles it too.

// Mailchimp Configuration
mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX,
});

const listId = process.env.MAILCHIMP_LIST_ID;

export default async function handler(req, res) {
    // Enable CORS manually if needed, or rely on Vercel configuration
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // another common pattern
    // res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    // res.setHeader(
    //   'Access-Control-Allow-Headers',
    //   'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    // )

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { firstName, lastName, email, result, answers } = req.body;

    console.log("Received submission:", req.body);

    if (!email || !firstName || !lastName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Compute MD5 hash of lowercase email (required by Mailchimp for upsert)
        const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

        const tags = [
            'website-lead',
            'newsletter-opt-in',
            'Welcher-Esser',
            result?.type ? `type-${result.type.replace(/\s+/g, '-').toLowerCase()}` : 'unknown-type'
        ];

        const mergeFields = {
            FNAME: firstName,
            LNAME: lastName,
            TYPE: result?.type || '',
            ALIAS: result?.typeAlias || '',
            PRODUCT: result?.productRecommendation || '',
        };

        // Use setListMember (PUT) – works for new, existing AND previously unsubscribed contacts.
        // For unsubscribed contacts Mailchimp requires re-opt-in ('pending'), not 'subscribed'.
        // status_if_new: 'subscribed' only applies to brand new contacts.
        const response = await mailchimp.lists.setListMember(listId, subscriberHash, {
            email_address: email,
            status_if_new: 'subscribed', // For new contacts → direct subscribe
            merge_fields: mergeFields,
        });

        console.log(`Upserted contact: ${email} | status: ${response.status}`);

        // If Mailchimp returned 'unsubscribed', the contact had previously opted out.
        // We cannot force-resubscribe them – instead set to 'pending' so they receive a re-opt-in email.
        if (response.status === 'unsubscribed') {
            await mailchimp.lists.updateListMember(listId, subscriberHash, {
                status: 'pending',
                merge_fields: mergeFields,
            });
            console.log(`Contact was unsubscribed – set to pending re-opt-in: ${email}`);
        }

        // Always update tags (separate endpoint)
        await mailchimp.lists.updateListMemberTags(listId, subscriberHash, {
            tags: tags.map(tag => ({ name: tag, status: 'active' }))
        });

        res.status(200).json({ success: true, message: 'Contact processed successfully!', status: response.status });

    } catch (e) {
        console.error("Error with Mailchimp:", e);
        const detail = e.response?.body?.detail || e.message || 'Unknown error';
        res.status(500).json({ error: 'Failed to process contact', detail });
    }
}
