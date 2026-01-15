/**
 * Email Service (SendGrid)
 * Handles lead notification emails with retry logic
 */

import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;
const salesEmail = process.env.SALES_EMAIL || 'sales@gogo.bj';
const fromEmail = process.env.FROM_EMAIL || 'noreply@gogo.bj';

if (apiKey) {
    sgMail.setApiKey(apiKey);
} else {
    console.warn('[Email] SendGrid API key not configured, using mock mode');
}

// ============================================================================
// Types
// ============================================================================

interface LeadEmailData {
    companyName: string;
    fleetSize: string;
    fuelType: string;
    email: string;
    phone: string;
}

interface EmailResult {
    success: boolean;
    error?: string;
    attempts: number;
}

// ============================================================================
// Email Functions
// ============================================================================

/**
 * Send lead notification with retry logic
 */
export async function sendLeadNotification(
    lead: LeadEmailData,
    maxRetries: number = 3
): Promise<EmailResult> {
    let attempts = 0;
    let lastError: string | undefined;

    while (attempts < maxRetries) {
        attempts++;

        try {
            const result = await sendEmail(lead);
            if (result.success) {
                console.log(`[Email] Lead notification sent (attempt ${attempts})`);
                return { success: true, attempts };
            }
            lastError = result.error;
        } catch (error) {
            lastError = error instanceof Error ? error.message : 'Unknown error';
        }

        // Exponential backoff: 1s, 2s, 4s
        if (attempts < maxRetries) {
            const delay = Math.pow(2, attempts - 1) * 1000;
            await sleep(delay);
        }
    }

    console.error(`[Email] Failed after ${attempts} attempts:`, lastError);
    return { success: false, error: lastError, attempts };
}

/**
 * Send single email attempt
 */
async function sendEmail(lead: LeadEmailData): Promise<{ success: boolean; error?: string }> {
    if (!apiKey) {
        // Mock mode
        console.log('[Email Mock] Would send notification for:', lead.companyName);
        return { success: true };
    }

    const msg = {
        to: salesEmail,
        from: fromEmail,
        subject: `🚀 New B2B Lead: ${lead.companyName}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ED6A21;">New Quote Request</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Company</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(lead.companyName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Fleet Size</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(lead.fleetSize)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Fuel Type</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(lead.fuelType)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Phone</strong></td>
            <td style="padding: 8px;"><a href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone)}</a></td>
          </tr>
        </table>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Sent via GoGo Imperial Energy Lead System
        </p>
      </div>
    `,
    };

    try {
        await sgMail.send(msg);
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'SendGrid error';
        return { success: false, error: errorMessage };
    }
}

// ============================================================================
// Helpers
// ============================================================================

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
