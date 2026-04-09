'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

export interface BusinessCardPrefill {
  name: string | null;
  role: string | null;
  city: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  linkedin_url: string | null;
}

const extractedSchema = z.object({
  name: z.string().nullable().default(null),
  role: z.string().nullable().default(null),
  city: z.string().nullable().default(null),
  email: z.string().nullable().default(null),
  phone: z.string().nullable().default(null),
  website: z.string().nullable().default(null),
  linkedin_url: z.string().nullable().default(null),
});

const PROMPT = `You are extracting contact information from a business card image.
Return ONLY a valid JSON object with these exact keys:
- name: full name of the person (string or null)
- role: job title or role (string or null)
- city: city or location (string or null)
- email: email address (string or null)
- phone: phone number (string or null)
- website: website URL (string or null)
- linkedin_url: LinkedIn profile URL (string or null)

If a field is not present on the card, use null. Do not add any explanation or markdown — only the raw JSON object.`;

export async function scanBusinessCardAction(
  base64: string
): Promise<{ data: BusinessCardPrefill } | { error: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { error: 'GEMINI_API_KEY is not configured' };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent([
      { inlineData: { mimeType: 'image/jpeg', data: base64 } },
      PROMPT,
    ]);
    const text = result.response.text().trim();

    // Strip markdown code fences if model wraps in ```json ... ```
    const json = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');

    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      return { error: 'Could not parse response from Gemini' };
    }

    const validated = extractedSchema.safeParse(parsed);
    if (!validated.success) {
      return { error: 'Unexpected response shape from Gemini' };
    }

    return { data: validated.data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { error: `Gemini request failed: ${message}` };
  }
}
