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
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
                TYPE: result?.type || '',
                ALIAS: result?.typeAlias || '',
                PRODUCT: result?.productRecommendation || '',
                // Map other necessary fields if they exist in Mailchimp
                // WGOAL: answers[2] || '', // Example mapping
            },
            tags: ['website-lead', 'newsletter-opt-in', 'Welcher-Esser', result?.type ? `type-${result.type.replace(/\s+/g, '-').toLowerCase()}` : 'unknown-type']
        });

        console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
        res.status(200).json({ success: true, message: 'Successfully subscribed to newsletter!', id: response.id });

    } catch (e) {
        console.error("Error with Mailchimp:", e);
        if (e.response && e.response.body && e.response.body.title === "Member Exists") {
            console.log("Member already exists. Updating existing member...");
            try {
                const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

                // 1. Update Merge Fields & Status
                await mailchimp.lists.updateListMember(listId, subscriberHash, {
                    status: 'subscribed', // Ensure they are resubscribed if they were unsubscribed
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName,
                        TYPE: result?.type || '',
                        ALIAS: result?.typeAlias || '',
                        PRODUCT: result?.productRecommendation || '',
                    }
                });

                // 2. Add Tags (Tags endpoint is separate for updates)
                const tagsToAdd = ['website-lead', 'newsletter-opt-in', 'Welcher-Esser', result?.type ? `type-${result.type.replace(/\s+/g, '-').toLowerCase()}` : 'unknown-type'];

                await mailchimp.lists.updateListMemberTags(listId, subscriberHash, {
                    tags: tagsToAdd.map(tag => ({ name: tag, status: 'active' }))
                });

                console.log(`Successfully updated existing contact: ${email}`);
                return res.status(200).json({ success: true, message: 'Successfully updated existing member!', updated: true });

            } catch (updateError) {
                console.error("Error updating existing member:", updateError);
                return res.status(500).json({ error: 'Failed to update existing member', detail: updateError.message });
            }
        }

        // Extract more detailed error info if available
        const errorDetail = e.response && e.response.body
            ? JSON.stringify(e.response.body)
            : e.message;

        res.status(500).json({ error: 'Failed to subscribe user', detail: errorDetail });
    }
}
