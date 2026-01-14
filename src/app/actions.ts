"use server";

import { QuoteSchema, QuoteData, QuoteFormResult } from "@/lib/quote-types";

export async function submitQuote(data: QuoteData): Promise<QuoteFormResult> {
    // Validate
    const validatedFields = QuoteSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // Log the submission (in production, save to DB or send email)
    console.log("✅ B2B Quote Submission:", validatedFields.data);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        success: true,
        message: "Quote request submitted successfully!",
    };
}
