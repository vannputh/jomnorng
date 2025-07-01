import { type NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const gemini = google("gemini-1.5-flash", {
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(request: NextRequest) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return NextResponse.json(
            {
                error: "Google Generative AI API key is not configured. Add it as `GOOGLE_GENERATIVE_AI_API_KEY`.",
            },
            { status: 500 }
        );
    }

    try {
        const {
            image,
            vibe,
            customPrompt,
            companyProfile,
            regenerate,
            language,
        } = await request.json();

        if (!image) {
            return NextResponse.json(
                { error: "No image provided" },
                { status: 400 }
            );
        }

        const vibePrompts = {
            casual: "casual, friendly, and relatable tone in both Khmer and English. Use everyday language and maybe some light humor.",
            professional:
                "professional, polished, and business-appropriate tone in both languages. Keep it clean and engaging.",
            fun: "fun, playful, and energetic tone in both languages. Use emojis and upbeat language.",
            inspirational:
                "inspirational and motivational tone in both languages. Focus on positive messages and encouragement.",
            trendy: "trendy, current, and social media savvy tone in both languages. Use popular phrases and relevant hashtags.",
        };

        const companyContext =
            companyProfile && companyProfile.company_name
                ? `
COMPANY PROFILE INFORMATION:
- Company Name: ${companyProfile.company_name}
- Business Type: ${companyProfile.business_type}
- Description: ${companyProfile.description}
- Target Audience: ${companyProfile.target_audience}
- Brand Voice: ${companyProfile.brand_voice}
- Company Size: ${companyProfile.company_size}
- Industry Focus: ${companyProfile.industry_focus}
- Marketing Goals: ${companyProfile.marketing_goals?.join(", ")}
- Brand Colors: ${companyProfile.brand_colors}
- Website: ${companyProfile.website_url}
- Social Handles: ${companyProfile.social_handles}
- Unique Selling Points: ${companyProfile.unique_selling_points}

IMPORTANT: Use this company information to create personalized, relevant captions that align with the company's brand, voice, and goals. Mention the company naturally when appropriate and ensure the captions reflect their business type and target audience.
`
                : "";

        const basePrompt = `Analyze this image and generate 3 different bilingual social media captions with a ${
            vibePrompts[vibe as keyof typeof vibePrompts] || vibePrompts.casual
        }

${companyContext}

CRITICAL FORMAT REQUIREMENTS - FOLLOW EXACTLY:
1. Each caption must start with exactly "[English Below]"
2. Next line: Write Khmer text (3-4 sentences, detailed and engaging)
3. Add 5-8 relevant Khmer hashtags on the same line as Khmer text
4. Next line: Write English text (3-4 sentences, detailed and engaging) 
5. Add 5-8 relevant English hashtags on the same line as English text
6. Leave a blank line between each caption

CONTENT REQUIREMENTS:
- Make captions detailed and engaging (150-250 characters each language)
- Focus on what's actually visible in the image
- If company profile provided, incorporate business context naturally
- Use brand voice and appeal to target audience
- Make them shareable and engagement-worthy

${customPrompt ? `Additional custom instructions: ${customPrompt}` : ""}

${
    regenerate
        ? "Generate completely new and different captions from any previous ones."
        : ""
}

EXACT FORMAT EXAMPLE:
[English Below]
ពិតជាស្អាតណាស់! រូបភាពនេះបង្ហាញពីភាពស្រស់ស្អាតនិងភាពរីករាយ។ វាធ្វើឱ្យយើងរំលឹកដល់ពេលវេលាដ៏ល្អនៅជាមួយគ្រួសារ។ #ស្រស់ស្អាត #រីករាយ #គ្រួសារ #ពេលវេលាល្អ #ជីវិត
So beautiful! This image shows such freshness and joy. It reminds us of wonderful times with family and loved ones. #beautiful #joy #family #goodtimes #life #happiness #moments #love

[English Below]
រូបភាពនេះពិតជាធ្វើឱ្យចិត្ត! វាបង្ហាញពីសុភមង្គលនិងភាពសប្បាយ។ អ្វីដែលអស្ចារ្យជាងនេះទេ! #សុភមង្គល #សប្បាយ #អស្ចារ្យ #ចិត្តល្អ #ភាពសុខ
This image is absolutely heartwarming! It captures such peace and happiness. Nothing could be more wonderful than this! #peaceful #happiness #wonderful #heartwarming #blessed #amazing #perfect #inspiring

[English Below]
ភាពស្រស់ស្អាតបែបនេះពិតជាកម្រ! វាបង្ហាញពីអ្វីដែលធម្មជាតិផ្តល់ឱ្យ។ យើងគួរតែរក្សាវាឱ្យបានយូរ។ #ធម្មជាតិ #ស្រស់ស្អាត #កម្រ #រក្សា #យូរ
This kind of beauty is truly rare! It shows what nature has gifted us. We should preserve it for a long time. #nature #beauty #rare #preserve #gift #natural #stunning #treasure

Return ONLY the 3 captions in the exact format above, separated by blank lines.`;

        const result = await generateText({
            model: gemini,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: basePrompt,
                        },
                        {
                            type: "image",
                            image: `data:image/jpeg;base64,${image}`,
                        },
                    ],
                },
            ],
        });

        // Parse the generated captions with improved logic
        const rawText = result.text.trim();
        console.log("Raw AI response:", rawText); // Debug logging

        // Split by "[English Below]" to get individual captions
        const captionBlocks = rawText
            .split("[English Below]")
            .filter((block) => block.trim().length > 0)
            .slice(0, 3); // Ensure we only get 3 captions

        // Process each caption block to ensure proper format
        const captions = captionBlocks
            .map((block) => {
                const lines = block
                    .trim()
                    .split("\n")
                    .filter((line) => line.trim().length > 0);

                if (lines.length >= 2) {
                    const khmerLine = lines[0].trim();
                    const englishLine = lines[1].trim();

                    // Reconstruct the caption with proper format
                    return `[English Below]\n${khmerLine}\n${englishLine}`;
                }

                // Fallback: return the block with "[English Below]" prefix if parsing fails
                return `[English Below]\n${block.trim()}`;
            })
            .filter((caption) => caption.includes("\n")); // Only include properly formatted captions

        console.log("Processed captions:", captions); // Debug logging

        return NextResponse.json({ captions });
    } catch (error) {
        console.error("Error analyzing image:", error);
        return NextResponse.json(
            { error: "Failed to analyze image" },
            { status: 500 }
        );
    }
}
