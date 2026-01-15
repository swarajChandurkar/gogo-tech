"use server";

import { QuoteSchema, QuoteData, QuoteFormResult } from "@/lib/quote-types";
import { insertLead, updateLeadEmailStatus } from "@/lib/supabase";
import { sendLeadNotification } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function submitQuote(data: QuoteData): Promise<QuoteFormResult> {
    // Validate
    const validatedFields = QuoteSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { companyName, fleetSize, fuelType, email, phone } = validatedFields.data;

    // Insert lead into database
    const { lead, error: dbError } = await insertLead({
        company_name: companyName,
        fleet_size: fleetSize,
        fuel_type: fuelType,
        email,
        phone,
        email_status: 'pending',
    });

    if (dbError || !lead) {
        console.error("❌ Failed to save lead:", dbError);
        return {
            success: false,
            message: "Failed to save your request. Please try again.",
        };
    }

    console.log("✅ B2B Quote Saved:", lead.id);

    // Send email notification (async, with retry)
    const emailResult = await sendLeadNotification({
        companyName,
        fleetSize,
        fuelType,
        email,
        phone,
    });

    // Update lead with email status
    await updateLeadEmailStatus(
        lead.id!,
        emailResult.success ? 'sent' : 'failed',
        emailResult.error
    );

    if (emailResult.success) {
        console.log("📧 Sales notification sent");
    } else {
        console.warn("⚠️ Email notification failed:", emailResult.error);
    }

    // Revalidate admin page so new lead shows up immediately
    revalidatePath('/admin');

    return {
        success: true,
        message: "Quote request submitted successfully!",
    };
}
