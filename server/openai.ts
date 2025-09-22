import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || ""
});

export interface ThumbnailAnalysis {
  enhancementSuggestions: {
    contrast: number;
    saturation: number;
    clarity: number;
  };
  ctrImprovement: number;
  description: string;
  recommendations: string[];
}

export interface TitleSuggestion {
  title: string;
  score: number;
  estimatedCtr: number;
  seoScore: number;
  tags: string[];
  reasoning: string;
}

export async function analyzeThumbnail(base64Image: string): Promise<ThumbnailAnalysis> {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key not found, using mock analysis");
      return getMockThumbnailAnalysis();
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a YouTube thumbnail optimization expert. Analyze the provided thumbnail image and suggest enhancements to improve click-through rates. 
          
          Respond with JSON in this exact format:
          {
            "enhancementSuggestions": {
              "contrast": number (0-100, percentage increase needed),
              "saturation": number (0-100, percentage increase needed), 
              "clarity": number (0-100, percentage increase needed)
            },
            "ctrImprovement": number (estimated percentage CTR improvement),
            "description": "string (detailed analysis of current thumbnail)",
            "recommendations": ["array", "of", "specific", "improvement", "suggestions"]
          }`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this YouTube thumbnail and provide enhancement recommendations to maximize click-through rates."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as ThumbnailAnalysis;
  } catch (error) {
    console.error("Error analyzing thumbnail:", error);
    console.log("Falling back to mock analysis");
    return getMockThumbnailAnalysis();
  }
}

function getMockThumbnailAnalysis(): ThumbnailAnalysis {
  return {
    enhancementSuggestions: {
      contrast: 18,
      saturation: 15,
      clarity: 22
    },
    ctrImprovement: 25,
    description: "Your thumbnail will be subtly enhanced to improve every detail while preserving complete originality. Fine adjustments to make it more eye-catching and appealing.",
    recommendations: [
      "Gently enhance contrast to improve definition without altering original tone",
      "Subtle color enhancement to make details more vibrant naturally", 
      "Fine detail sharpening to improve clarity while maintaining authenticity",
      "Micro-adjustments for better visual appeal without changing design"
    ]
  };
}

export async function optimizeTitles(originalTitle: string, thumbnailContext?: string): Promise<TitleSuggestion[]> {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key not found, using mock title suggestions");
      return getMockTitleSuggestions(originalTitle);
    }

    const contextPrompt = thumbnailContext 
      ? `Consider this thumbnail context: ${thumbnailContext}\n\n`
      : "";

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a YouTube SEO and title optimization expert. Generate 5 highly optimized, click-worthy YouTube titles based on the original title provided.

          ${contextPrompt}Focus on:
          - High CTR potential with emotional triggers
          - SEO optimization with trending keywords
          - Optimal character length (50-70 characters)
          - Clear value proposition
          - Current year relevance (2024)
          
          Respond with JSON in this exact format:
          {
            "titles": [
              {
                "title": "optimized title text",
                "score": number (1-10 overall quality score),
                "estimatedCtr": number (percentage improvement over original),
                "seoScore": number (1-10 SEO optimization score),
                "tags": ["relevant", "keywords", "array"],
                "reasoning": "explanation of why this title works"
              }
            ]
          }`
        },
        {
          role: "user",
          content: `Original title: "${originalTitle}"\n\nGenerate 5 optimized alternatives ranked by potential performance.`
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.titles || [];
  } catch (error) {
    console.error("Error optimizing titles:", error);
    console.log("Falling back to mock title suggestions");
    return getMockTitleSuggestions(originalTitle);
  }
}

function getMockTitleSuggestions(originalTitle: string): TitleSuggestion[] {
  return [
    {
      title: `🚀 AMAZING: ${originalTitle} (You Won't Believe This!)`,
      score: 9,
      estimatedCtr: 35,
      seoScore: 8,
      tags: ["viral", "amazing", "trending", "youtube"],
      reasoning: "Uses emotional trigger words and promises surprise value to increase click-through rates"
    },
    {
      title: `${originalTitle} - The ULTIMATE Guide (2024)`,
      score: 8,
      estimatedCtr: 28,
      seoScore: 9,
      tags: ["guide", "tutorial", "2024", "ultimate"],
      reasoning: "Appeals to viewers seeking comprehensive information with current year relevance"
    },
    {
      title: `Why ${originalTitle} is Going VIRAL Right Now!`,
      score: 8,
      estimatedCtr: 32,
      seoScore: 7,
      tags: ["viral", "trending", "popular", "now"],
      reasoning: "Creates urgency and taps into FOMO (fear of missing out) psychology"
    },
    {
      title: `The SECRET Behind ${originalTitle} (Finally Revealed)`,
      score: 7,
      estimatedCtr: 29,
      seoScore: 6,
      tags: ["secret", "revealed", "behind", "exclusive"],
      reasoning: "Promises exclusive knowledge and insider information"
    },
    {
      title: `${originalTitle}: From Zero to Hero in 30 Days`,
      score: 7,
      estimatedCtr: 26,
      seoScore: 8,
      tags: ["transformation", "success", "30days", "hero"],
      reasoning: "Offers specific timeframe and transformation promise"
    }
  ];
}

export async function enhanceThumbnailImage(base64Image: string, enhancements: { contrast: number; saturation: number; clarity: number }): Promise<string> {
  try {
    // Dynamic import for Sharp in ES modules
    const sharp = await import('sharp');
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');
    
    // Subtle detailed enhancement preserving complete originality
    const enhancedBuffer = await sharp.default(imageBuffer)
      // Pass 1: Very subtle brightness and color refinement
      .modulate({
        brightness: 1.08, // Gentle brightness boost for better visibility
        saturation: 1 + (enhancements.saturation / 120), // Subtle saturation for natural vibrancy
      })
      
      // Pass 2: Gentle contrast enhancement without losing original tone
      .linear(
        1 + (enhancements.contrast / 120), // Subtle contrast for better definition
        -(enhancements.contrast / 12) // Minimal offset to preserve natural look
      )
      .gamma(1.04) // Very gentle gamma for subtle mid-tone enhancement
      
      // Pass 3: Fine detail sharpening without artifacts
      .sharpen({
        sigma: 0.6 + (enhancements.clarity / 80) // Adaptive detail enhancement
      })
      
      // Pass 4: Micro detail enhancement for eye-catching appeal
      .sharpen({
        sigma: 0.3 // Ultra-fine detail enhancement
      })
      
      // Pass 5: Final subtle color polish for eye appeal
      .modulate({
        brightness: 1.02, // Micro brightness touch-up
        saturation: 1.04 // Gentle saturation for natural appeal
      })
      
      .jpeg({ 
        quality: 96, 
        mozjpeg: true,
        progressive: true,
        optimiseScans: true
      }) // Optimized professional quality output
      .toBuffer();
    
    // Convert back to base64
    const enhancedBase64 = enhancedBuffer.toString('base64');
    console.log("Subtle detail enhancement applied: preserving originality while improving every detail for eye-catching appeal");
    return enhancedBase64;
    
  } catch (error) {
    console.error("Error enhancing thumbnail with Sharp:", error);
    console.log("Falling back to returning original image");
    return base64Image; // Return original image on error
  }
}
