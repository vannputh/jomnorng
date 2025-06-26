import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

const gemini = google("gemini-1.5-flash", {
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export async function POST(request: NextRequest) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json(
      { error: "Google Generative AI API key is not configured. Add it as `GOOGLE_GENERATIVE_AI_API_KEY`." },
      { status: 500 },
    )
  }

  try {
    const { image, vibe, customPrompt, companyProfile, regenerate, language } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const vibePrompts = {
      casual:
        "casual, friendly, and relatable tone in both Khmer and English. Use everyday language and maybe some light humor.",
      professional:
        "professional, polished, and business-appropriate tone in both languages. Keep it clean and engaging.",
      fun: "fun, playful, and energetic tone in both languages. Use emojis and upbeat language.",
      inspirational:
        "inspirational and motivational tone in both languages. Focus on positive messages and encouragement.",
      trendy:
        "trendy, current, and social media savvy tone in both languages. Use popular phrases and relevant hashtags.",
    }

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
        : ""

    const basePrompt = `Analyze this image and generate 3 different bilingual social media captions (Khmer and English) with a ${vibePrompts[vibe as keyof typeof vibePrompts] || vibePrompts.casual}

${companyContext}

IMPORTANT FORMAT REQUIREMENTS:
- Each caption must start with "[English Below]" 
- Then write the Khmer text (3-4 sentences, detailed and engaging, incorporating company context when relevant)
- Then write the English text below the Khmer (3-4 sentences, detailed and engaging, incorporating company context when relevant)
- End with 8-12 relevant hashtags in both languages (#ខ្មែរ #English)
- Make the captions longer and more detailed (200-300 characters each language)
- Focus on what's actually visible in the image
- Make them shareable and likely to get engagement
- If company profile is provided, naturally incorporate the business context, brand voice, and target audience
- Use the company's brand colors, unique selling points, and marketing goals to enhance the captions

${customPrompt ? `Additional custom instructions: ${customPrompt}` : ""}

${regenerate ? "Generate completely new and different captions from any previous ones." : ""}

Example format:
[English Below]
ខ្មែរ text here with detailed description, company context, and engaging content that reflects the brand voice and appeals to the target audience...
English text here with detailed description, company context, and engaging content that reflects the brand voice and appeals to the target audience...
#hashtag1 #hashtag2 #ខ្មែរ #English #companyrelated #industryspecific

Return only the captions, separated by double line breaks, without numbering.`

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
    })

    const captions = result.text
      .split("\n\n")
      .filter((caption) => caption.trim().length > 0 && caption.includes("[English Below]"))
      .slice(0, 3) // Ensure we only get 3 captions

    return NextResponse.json({ captions })
  } catch (error) {
    console.error("Error analyzing image:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
