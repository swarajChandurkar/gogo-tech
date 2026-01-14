"use server";

import { QuoteSchema, QuoteData, QuoteFormResult } from "@/lib/quote-types";
import { saveLead } from "@/lib/db";
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

    // Save to local "database" (JSON file)
    await saveLead(validatedFields.data);

    // Log for debug
    console.log("✅ B2B Quote Saved:", validatedFields.data);

    // Revalidate admin page so new lead shows up immediately
    revalidatePath('/admin');

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        success: true,
        message: "Quote request submitted successfully!",
    };
}
