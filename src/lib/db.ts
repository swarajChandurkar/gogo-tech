import fs from 'fs/promises';
import path from 'path';
import { QuoteData } from './quote-types';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'leads.json');

export async function getLeads(): Promise<QuoteData[]> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function saveLead(lead: QuoteData) {
    try {
        // Ensure directory exists
        const dir = path.dirname(DB_PATH);
        await fs.mkdir(dir, { recursive: true });

        const leads = await getLeads();
        // Add timestamp for display
        const newLead = { ...lead, submittedAt: new Date().toISOString() };
        leads.unshift(newLead); // Add to top

        await fs.writeFile(DB_PATH, JSON.stringify(leads, null, 2));
        return true;
    } catch (error) {
        console.error("Error saving lead:", error);
        return false;
    }
}
