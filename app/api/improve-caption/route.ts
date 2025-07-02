import { type NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const gemini = google("gemini-1.5-flash");

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
            originalCaption,
            vibe,
            customPrompt,
            captionLength,
            companyProfile,
            language,
            customImprovementMessage,
        } = await request.json();

        if (!originalCaption) {
            return NextResponse.json(
                { error: "No original caption provided" },
                { status: 400 }
            );
        }

        const vibePrompts = {
            casual: "casual, friendly, and relatable tone in both Khmer and English. Use everyday language and warm, approachable messaging.",
            professional:
                "professional, polished, and business-appropriate tone in both languages. Keep it clean, credible, and engaging.",
            fun: "fun, playful, and energetic tone in both languages. Use emojis, upbeat language, and engaging expressions.",
            inspirational:
                "inspirational and motivational tone in both languages. Focus on positive messages, encouragement, and empowerment.",
            trendy: "trendy, current, and social media savvy tone in both languages. Use popular phrases, modern expressions, and relevant hashtags.",
            luxury: "luxury, elegant, and sophisticated tone in both languages. Use refined language, premium positioning, and exclusivity messaging.",
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

IMPORTANT: Use this company information to create personalized, relevant captions that align with the company's brand, voice, and goals.
`
                : "";

        const lengthInstructions = {
            short: "Keep captions short and concise (exactly 3 sentences per language)",
            medium: "Create medium-length captions (exactly 5 sentences per language)",
            long: "Write detailed, comprehensive captions (exactly 10 sentences per language)"
        };

        // Get sentence count for dynamic formatting
        const getSentenceCount = (length: string) => {
            switch (length) {
                case 'short': return 3;
                case 'medium': return 5;
                case 'long': return 10;
                default: return 5;
            }
        };

        const sentenceCount = getSentenceCount(captionLength);

        const improvePrompt = `Improve this social media caption by creating 3 different enhanced versions. Each version should have a different improvement approach:

ORIGINAL CAPTION:
"${originalCaption}"

${companyContext}

IMPROVEMENT REQUIREMENTS:
- Maintain the same general tone and ${vibePrompts[vibe as keyof typeof vibePrompts] || vibePrompts.casual}
- ${lengthInstructions[captionLength as keyof typeof lengthInstructions] || lengthInstructions.medium}
- Keep it bilingual (Khmer and English) with exact translations
- The English text MUST be a direct translation of the Khmer text with the same meaning
- Write exactly ${sentenceCount} sentences for each language (Khmer and English)
- Both versions should convey identical information, just in different languages
${customPrompt ? `- Original custom requirements: ${customPrompt}` : ''}
${customImprovementMessage ? `- Additional improvement instructions: ${customImprovementMessage}` : ''}

CREATE 3 DIFFERENT IMPROVEMENT APPROACHES:

VERSION 1 - MORE ENGAGING: Make it more engaging and compelling while keeping the core message
VERSION 2 - MORE PROFESSIONAL: Enhance professionalism and credibility 
VERSION 3 - MORE CREATIVE: Add creativity and unique flair while maintaining authenticity

CRITICAL FORMAT REQUIREMENTS - FOLLOW EXACTLY:
1. Each improved caption must start with exactly "[VERSION X - APPROACH NAME]"
2. Next line: "[English Below]"
3. Next line: Write Khmer text (exactly ${sentenceCount} sentences, detailed and engaging)
4. Add 5-8 relevant Khmer hashtags on the same line as Khmer text
5. Next line: Write English text (exactly ${sentenceCount} sentences, detailed and engaging) 
6. Add 5-8 relevant English hashtags on the same line as English text
7. Leave a blank line between each version

EXAMPLE FORMAT:
[VERSION 1 - MORE ENGAGING]
[English Below]
ពិតជាស្អាតណាស់! រូបភាពនេះបង្ហាញពីភាពស្រស់ស្អាត។ វាធ្វើឱ្យយើងរំលឹកដល់ពេលវេលាល្អ។ #ស្រស់ស្អាត #រីករាយ #ជីវិត
So beautiful! This image shows such freshness and beauty. It reminds us of wonderful times. #beautiful #joy #life

[VERSION 2 - MORE PROFESSIONAL]
[English Below]
រូបភាពនេះបង្ហាញពីគុណភាពខ្ពស់។ វាសំដៅលើភាពជាក់លាក់និងសុភមង្គល។ ការងារនេះពិតជាអស្ចារ្យ។ #គុណភាព #ជាក់លាក់ #អាជីព
This image demonstrates high quality. It represents clarity and excellence. This work is truly remarkable. #quality #clarity #professional

[VERSION 3 - MORE CREATIVE]
[English Below]
នេះជាសិល្បៈដ៏អស្ចារ្យ! ភាពស្រស់ស្អាតនេះនាំឱ្យស្រមៃ។ វាបង្កើតចិត្តគំនិតថ្មី។ #សិល្បៈ #ស្រមៃ #ថ្មី
This is amazing art! This beauty inspires imagination. It creates new ideas. #art #imagination #new

Return ONLY the 3 improved captions in the exact format above, separated by blank lines.`;

        const result = await generateText({
            model: gemini,
            messages: [
                {
                    role: "user",
                    content: improvePrompt,
                },
            ],
            maxTokens: 800,
            temperature: 0.8,
        });

        // Parse the generated improved captions
        const rawText = result.text.trim();
        console.log("Raw AI improvement response:", rawText);

        // Split by "[VERSION" to get individual improved captions
        const improvementBlocks = rawText
            .split(/\[VERSION \d+ - [^\]]+\]/)
            .filter((block) => block.trim().length > 0)
            .slice(0, 3); // Ensure we only get 3 improvements

        // Process each improvement block
        const improvedCaptions = [];
        const versionTitles = rawText.match(/\[VERSION \d+ - [^\]]+\]/g) || [];

        for (let i = 0; i < Math.min(improvementBlocks.length, versionTitles.length); i++) {
            const block = improvementBlocks[i];
            const versionTitle = versionTitles[i];
            
            // Split by "[English Below]" and process
            const captionContent = block.split("[English Below]").filter(part => part.trim().length > 0)[0];
            
            if (captionContent) {
                const lines = captionContent
                    .trim()
                    .split("\n")
                    .filter((line) => line.trim().length > 0);

                if (lines.length >= 2) {
                    const khmerLine = lines[0].trim();
                    const englishLine = lines[1].trim();

                    // Reconstruct the caption with proper format
                    const improvedCaption = `${versionTitle}\n[English Below]\n${khmerLine}\n${englishLine}`;
                    improvedCaptions.push(improvedCaption);
                }
            }
        }

        // Fallback if parsing fails
        if (improvedCaptions.length === 0) {
            improvedCaptions.push(
                `[VERSION 1 - IMPROVED]\n[English Below]\n${originalCaption}`,
                `[VERSION 2 - ENHANCED]\n[English Below]\n${originalCaption}`,
                `[VERSION 3 - OPTIMIZED]\n[English Below]\n${originalCaption}`
            );
        }

        console.log("Processed improved captions:", improvedCaptions);

        return NextResponse.json({ 
            improvedCaptions,
            success: true 
        });
    } catch (error) {
        console.error("Error improving caption:", error);
        return NextResponse.json(
            { error: "Failed to improve caption" },
            { status: 500 }
        );
    }
} 