import mailchimp from '@mailchimp/mailchimp_marketing';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.MAILCHIMP_API_KEY;
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
const listId = process.env.MAILCHIMP_LIST_ID;

if (!apiKey || !serverPrefix || !listId) {
    console.error("Error: Missing Mailchimp configuration in .env file.");
    process.exit(1);
}

mailchimp.setConfig({
    apiKey: apiKey,
    server: serverPrefix,
});

async function setupMergeFields() {
    console.log(`Checking merge fields for List ID: ${listId}...`);

    try {
        // 1. Get existing merge fields
        const response = await mailchimp.lists.getListMergeFields(listId);
        const existingTags = response.merge_fields.map(field => field.tag);
        console.log("Existing Merge Fields:", existingTags);

        // 2. Define required fields
        const requiredFields = [
            { tag: 'TYPE', name: 'Esser-Typ', type: 'text' },
            { tag: 'ALIAS', name: 'Typ-Alias', type: 'text' },
            { tag: 'PRODUCT', name: 'Empfehlung', type: 'text' }
        ];

        // 3. Create missing fields
        for (const field of requiredFields) {
            if (!existingTags.includes(field.tag)) {
                console.log(`Creating missing field: ${field.tag} (${field.name})...`);
                try {
                    await mailchimp.lists.addListMergeField(listId, {
                        tag: field.tag,
                        name: field.name,
                        type: field.type,
                        public: false // Don't show on public signup forms by default
                    });
                    console.log(`✅ Created field: ${field.tag}`);
                } catch (error) {
                    console.error(`❌ Failed to create field ${field.tag}:`, error.response ? error.response.body : error.message);
                }
            } else {
                console.log(`✓ Field ${field.tag} already exists.`);
            }
        }

        console.log("\nDone! All required merge fields are set up.");

    } catch (error) {
        console.error("Error connecting to Mailchimp:", error.response ? error.response.body : error.message);
    }
}

setupMergeFields();
