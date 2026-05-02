import { GoogleGenAI, Type } from "@google/genai";
import { Market, Product, SourcingOption, SupplierEmail, Marketplace, ProductListing } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const DEFAULT_MODEL = "gemini-3-flash-preview";
const PRO_MODEL = "gemini-3.1-pro-preview";

const AGENT_SYSTEM_INSTRUCTION = `You are OmniSeller AI Voice Assistant, an intelligent and friendly AI designed to help users manage and grow their e-commerce business across multiple platforms (Amazon, eBay, Daraz, Shopify).

🎯 Your behavior rules:
1. PLATFORM-SPECIFIC RESPONSES:
- For Amazon → Talk about FBA, product hunting, fees, competition, listing SEO.
- For eBay → Talk about bidding, used products, seller ratings, pricing strategy.
- For Daraz → Talk about local market trends, pricing, and supplier advantages.
- For Shopify → Talk about store setup, branding, ads, and dropshipping.
2. SMART DETECTION: Automatically detect which platform the user is talking about, even if not clearly mentioned.
3. GENERAL CONVERSATION: Respond warmly to greetings and naturally to small talk. Answer basic questions simply and human-like.
4. BUSINESS ASSISTANT MODE: Guide the user like a business partner. Suggest profitable ideas, growth tips, and better strategies (Discovery -> Analysis -> Profit Estimation -> Sourcing -> Listing -> Launch).
5. VOICE-FRIENDLY & STYLE: Keep answers clear, short, and professional but friendly. Avoid long paragraphs.
6. MULTI-FUNCTION SUPPORT: Help with product hunting, sourcing, listing optimization, profit calculation, and market analysis.`;

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.status === 429 || error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED"))) {
      console.warn(`Gemini API rate limited. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const generateListing = async (title: string, keywords: string[], marketplace: Marketplace = Marketplace.AMAZON): Promise<ProductListing> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Generate a complete optimized product listing for ${marketplace} with the following title: "${title}" and keywords: ${keywords.join(", ")}. 
      Ensure the format perfectly matches ${marketplace} requirements (e.g., bullet points for Amazon, rich description for Shopify, punchy copy for TikTok Shop).`,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            backendSearchTerms: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["title", "description", "keywords", "improvements"],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  });
};

export const huntProducts = async (market: Market, marketplace: Marketplace = Marketplace.AMAZON, category?: string): Promise<Product[]> => {
  return withRetry(async () => {
    const query = marketplace === Marketplace.ALL 
      ? `Find 5 profitable products crossing multiple markets (Amazon, eBay, TikTok Shop, Daraz, Shopify). Compare them.`
      : `Find 5 profitable and trending products for ${marketplace} in the ${market} market${category ? ` and ${category} category` : ""}.`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: query,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              asin: { type: Type.STRING },
              sku: { type: Type.STRING },
              link: { type: Type.STRING },
              price: { type: Type.NUMBER },
              estimatedCost: { type: Type.NUMBER },
              profit: { type: Type.NUMBER },
              profitMargin: { type: Type.NUMBER },
              competition: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              demand: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              market: { type: Type.STRING },
              marketplace: { type: Type.STRING },
              reviews: { type: Type.NUMBER },
              rating: { type: Type.NUMBER },
              monthlySales: { type: Type.NUMBER },
              image: { type: Type.STRING },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["id", "name", "link", "price", "estimatedCost", "profit", "profitMargin", "competition", "demand", "market", "marketplace", "suggestions"],
          },
        },
      },
    });
    return JSON.parse(response.text || "[]");
  });
};

export const findSourcing = async (productName: string, imageBase64?: string, marketplace: Marketplace = Marketplace.AMAZON): Promise<SourcingOption[]> => {
  return withRetry(async () => {
    const parts: any[] = [
      { text: `Find 3 sourcing options for the product: "${productName}" to be sold on ${marketplace}. 
      For each supplier, provide:
      - supplierName
      - location
      - platform
      - price
      - moq
      - email
      - link
      - shippingTime
      - rating
      - sellingPrice (estimated for ${marketplace})
      - platformFees (estimated for ${marketplace} fees)
      - estimatedProfit
      - roi
      - suggestions` }
    ];

    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64.split(",")[1],
          mimeType: "image/png",
        },
      });
    }

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: { parts },
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              supplierName: { type: Type.STRING },
              location: { type: Type.STRING },
              platform: { type: Type.STRING },
              price: { type: Type.NUMBER },
              moq: { type: Type.NUMBER },
              email: { type: Type.STRING },
              link: { type: Type.STRING },
              shippingTime: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              sellingPrice: { type: Type.NUMBER },
              platformFees: { type: Type.NUMBER },
              estimatedProfit: { type: Type.NUMBER },
              roi: { type: Type.NUMBER },
              images: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: [
              "id", "supplierName", "location", "platform", "price", "moq", 
              "email", "link", "shippingTime", "rating", "sellingPrice", 
              "platformFees", "estimatedProfit", "roi", "suggestions"
            ],
          },
        },
      },
    });
    return JSON.parse(response.text || "[]");
  });
};

export const generateSupplierEmail = async (type: string, details: string): Promise<SupplierEmail> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Generate a professional supplier email for: "${type}". Context: ${details}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING },
          },
          required: ["subject", "body"],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  });
};

export const detectTrends = async (marketplace: Marketplace = Marketplace.AMAZON): Promise<any[]> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Identify 5 trending product niches for ${marketplace} right now. Include demand score and competition score.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              niche: { type: Type.STRING },
              demandScore: { type: Type.NUMBER },
              competitionScore: { type: Type.NUMBER },
              growthRate: { type: Type.STRING },
            },
            required: ["niche", "demandScore", "competitionScore", "growthRate"],
          },
        },
      },
    });
    return JSON.parse(response.text || "[]");
  });
};

export const analyzeCompetition = async (productName: string, market: Market, marketplace: Marketplace = Marketplace.AMAZON): Promise<any> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Analyze the competition for "${productName}" in the ${market} ${marketplace} market. Provide a detailed breakdown of top competitors, review counts, ratings, price range, barriers to entry, and a recommendation.`,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            competitors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sales: { type: Type.STRING },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["name", "sales", "strengths", "weaknesses"],
              },
            },
            avgReviews: { type: Type.NUMBER },
            avgRating: { type: Type.NUMBER },
            priceRange: { type: Type.STRING },
            barriers: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING },
            reasoning: { type: Type.STRING },
          },
          required: ["competitors", "avgReviews", "avgRating", "priceRange", "barriers", "recommendation", "reasoning"],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  });
};

export const detectMarketGaps = async (market: Market, marketplace: Marketplace = Marketplace.AMAZON): Promise<Product[]> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Identify 5 high-potential market gaps in the ${marketplace} ${market} market. These should be products with high demand but poor current listings or low competition on that specific platform.`,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              asin: { type: Type.STRING },
              sku: { type: Type.STRING },
              link: { type: Type.STRING },
              price: { type: Type.NUMBER },
              estimatedCost: { type: Type.NUMBER },
              profit: { type: Type.NUMBER },
              profitMargin: { type: Type.NUMBER },
              competition: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              demand: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              market: { type: Type.STRING },
              marketplace: { type: Type.STRING },
              reviews: { type: Type.NUMBER },
              rating: { type: Type.NUMBER },
              monthlySales: { type: Type.NUMBER },
              image: { type: Type.STRING },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["id", "name", "link", "price", "estimatedCost", "profit", "profitMargin", "competition", "demand", "market", "marketplace", "suggestions"],
          },
        },
      },
    });
    return JSON.parse(response.text || "[]");
  });
};

export const analyzeListingImage = async (base64Image: string, marketplace: Marketplace = Marketplace.AMAZON): Promise<any> => {
  return withRetry(async () => {
    // Step 1: Analyze the image
    const analysisResponse = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [
        { text: `Analyze this product listing image for ${marketplace}. Evaluate image quality, lighting, background, and product visibility according to ${marketplace} best practices. Provide a quality score out of 100 and specific improvement tips.` },
        { inlineData: { mimeType: "image/jpeg", data: base64Image } }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            qualityScore: { type: Type.NUMBER },
            lighting: { type: Type.STRING },
            background: { type: Type.STRING },
            productVisibility: { type: Type.STRING },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["qualityScore", "lighting", "background", "productVisibility", "improvements"]
        }
      }
    });
    const analysis = JSON.parse(analysisResponse.text || "{}");

    // Step 2: Generate an improved version of the image
    const improvedImageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: "image/jpeg",
            },
          },
          {
            text: `Generate an improved version of this ${marketplace} product listing image based on these tips: ${analysis.improvements.join(", ")}. Make it look professional, with perfect lighting and a clean background suitable for ${marketplace}.`,
          },
        ],
      },
    });

    let improvedImageBase64 = "";
    for (const part of improvedImageResponse.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        improvedImageBase64 = part.inlineData.data;
        break;
      }
    }

    return {
      ...analysis,
      improvedImage: improvedImageBase64 ? `data:image/png;base64,${improvedImageBase64}` : null
    };
  });
};

export const optimizeTitle = async (currentTitle: string, marketplace: Marketplace = Marketplace.AMAZON): Promise<any> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Optimize this product title for ${marketplace} SEO: "${currentTitle}". Ensure it follows ${marketplace} title length and keyword rules. Provide the optimized title, keywords used, and a score.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            keywordsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
            score: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["title", "keywordsUsed", "score", "reasoning"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  });
};

export const findKeywordOpportunities = async (productName: string, marketplace: Marketplace = Marketplace.AMAZON): Promise<any[]> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Find high-opportunity SEO keywords for "${productName}" specifically for the ${marketplace} search algorithm. Include estimated search volume and competition level.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              searchVolume: { type: Type.NUMBER },
              competition: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              opportunityScore: { type: Type.NUMBER }
            },
            required: ["keyword", "searchVolume", "competition", "opportunityScore"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  });
};

export const detectFakeReviews = async (reviews: string[] | string): Promise<any> => {
  return withRetry(async () => {
    const reviewsContent = Array.isArray(reviews) ? JSON.stringify(reviews) : reviews;
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Analyze these Amazon reviews for suspicious patterns or fake review indicators: ${reviewsContent}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            authenticityScore: { type: Type.NUMBER },
            redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
            verdict: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["authenticityScore", "redFlags", "verdict", "reasoning"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  });
};

export const generateDemandHeatmap = async (query: string): Promise<any[]> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Generate demand heatmap data for "${query}" across different regions. Provide a list of regions with demand scores (0-100) and coordinates (top/left percentages for a map visualization).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              region: { type: Type.STRING },
              score: { type: Type.NUMBER },
              top: { type: Type.STRING },
              left: { type: Type.STRING },
              size: { type: Type.STRING }
            },
            required: ["region", "score", "top", "left", "size"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  });
};

export const generateLaunchStrategy = async (product: Product | string, marketplace: Marketplace = Marketplace.AMAZON): Promise<any> => {
  return withRetry(async () => {
    const productInfo = typeof product === 'string' ? product : JSON.stringify(product);
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Generate a detailed step-by-step ${marketplace} launch strategy for: ${productInfo}. Include initial traffic generation, paid advertising (${marketplace === Marketplace.AMAZON ? 'PPC' : 'Ads'}), and optimization phases.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            phases: {
              type: Type.OBJECT,
              properties: {
                preLaunch: { type: Type.ARRAY, items: { type: Type.STRING } },
                launchWeek: { type: Type.ARRAY, items: { type: Type.STRING } },
                postLaunch: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["preLaunch", "launchWeek", "postLaunch"]
            },
            marketingStrategy: { type: Type.STRING },
            budgetAllocation: {
              type: Type.OBJECT,
              properties: {
                ads: { type: Type.NUMBER },
                inventory: { type: Type.NUMBER },
                marketing: { type: Type.NUMBER },
                other: { type: Type.NUMBER }
              },
              required: ["ads", "inventory", "marketing", "other"]
            }
          },
          required: ["phases", "marketingStrategy", "budgetAllocation"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  });
};

export const findNiches = async (category: string): Promise<any[]> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Identify 5 low-competition, high-demand niches in the "${category}" category on Amazon.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              niche: { type: Type.STRING },
              demand: { type: Type.STRING },
              competition: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              profitPotential: { type: Type.STRING }
            },
            required: ["niche", "demand", "competition", "keywords", "profitPotential"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  });
};

export const generateProductImprovements = async (competitorData: string[] | string): Promise<any[]> => {
  return withRetry(async () => {
    const dataContent = Array.isArray(competitorData) ? JSON.stringify(competitorData) : competitorData;
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Analyze this product/competitor data and suggest 5 product improvements to stand out: ${dataContent}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              difficulty: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
            },
            required: ["title", "description", "impact", "difficulty"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  });
};

export const predictSalesForecast = async (product: Product | string): Promise<any[]> => {
  return withRetry(async () => {
    const productInfo = typeof product === 'string' ? product : JSON.stringify(product);
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Predict estimated sales and revenue for the next 3 months for this product: ${productInfo}. Provide a monthly breakdown.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              month: { type: Type.STRING },
              units: { type: Type.NUMBER },
              revenue: { type: Type.NUMBER },
              profit: { type: Type.NUMBER },
              confidence: { type: Type.NUMBER }
            },
            required: ["month", "units", "revenue", "profit", "confidence"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  });
};

export const calculateSuccessScore = async (product: Product | string, marketplace: Marketplace = Marketplace.AMAZON): Promise<any> => {
  return withRetry(async () => {
    const productInfo = typeof product === 'string' ? product : JSON.stringify(product);
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Calculate a success score (0-100) for this product on ${marketplace} based on demand, competition, trend, and profit potential: ${productInfo}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            factors: {
              type: Type.OBJECT,
              properties: {
                demand: { type: Type.NUMBER },
                competition: { type: Type.NUMBER },
                trend: { type: Type.NUMBER },
                profit: { type: Type.NUMBER }
              },
              required: ["demand", "competition", "trend", "profit"]
            },
            recommendation: { type: Type.STRING }
          },
          required: ["score", "factors", "recommendation"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  });
};

export const runAutoResearch = async (market: Market, marketplace: Marketplace = Marketplace.AMAZON): Promise<any> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Perform an Autonomous Research Workflow for the ${marketplace} ${market} market. 
      1. Identify the single best trending product opportunity for ${marketplace}.
      2. Find 3 sourcing options for it.
      3. Calculate profit and ROI (factoring in ${marketplace} fees).
      4. Provide strategic business recommendations.`,
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            product: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                asin: { type: Type.STRING },
                sku: { type: Type.STRING },
                price: { type: Type.NUMBER },
                demand: { type: Type.STRING },
                competition: { type: Type.STRING },
              },
              required: ["name", "price", "demand", "competition"],
            },
            suppliers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  supplierName: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  moq: { type: Type.NUMBER },
                  estimatedProfit: { type: Type.NUMBER },
                  roi: { type: Type.NUMBER },
                },
                required: ["supplierName", "price", "moq", "estimatedProfit", "roi"],
              },
            },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING },
          },
          required: ["product", "suppliers", "recommendations", "summary"],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  });
};

export const chatWithAssistant = async (message: string, history: { role: 'user' | 'ai', text: string }[], marketplace: Marketplace = Marketplace.AMAZON): Promise<{ 
  text: string, 
  intent?: string, 
  data?: any,
  insights?: {
    marketTrend: 'Green' | 'Yellow' | 'Red';
    competitionRisk: 'Green' | 'Yellow' | 'Red';
    profitPotential: 'Green' | 'Yellow' | 'Red';
    launchDifficulty: 'Green' | 'Yellow' | 'Red';
  },
  alerts?: { title: string, description: string, roi: string }[]
}> => {
  return withRetry(async () => {
    const contents = history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents,
      config: {
        systemInstruction: `You are OmniSeller AI Voice Assistant, an intelligent and friendly business partner.
        Your goal is to help users grow their selling business on ${marketplace} (currently selected), while also supporting eBay, Daraz, and Shopify.
        
        🎯 BEHAVIOR:
        1. PLATFORM-SPECIFIC: For ${marketplace}, provide deep insights (Amazon: FBA/SEO, eBay: Bidding/Pricing, Daraz: Suppliers, Shopify: Ads/Branding).
        2. CONVERSATIONAL: Respond warmly to "Hi", "Hello", etc. Keep responses human-like and friendly.
        3. ADVISORY: Proactively suggest Discovery -> Analysis -> Sourcing -> Listing -> Launch.
        4. VOICE-FRIENDLY: Clear, short, no long paragraphs. Professional but friendly.
        
        AVAIALBLE INTENTS: HUNT, SOURCE, LISTING, EMAIL, AUTO_HUNTER, DASHBOARD.
        
        Response MUST be JSON:
        {
          "text": "Your natural conversational response...",
          "intent": "OPTIONAL_INTENT",
          "data": { "productName": "Optional" },
          "insights": { "marketTrend": "Green|Yellow|Red", ... },
          "alerts": [{ "title": "...", "description": "...", "roi": "..." }]
        }`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            intent: { type: Type.STRING, enum: ["HUNT", "SOURCE", "LISTING", "EMAIL", "AUTO_HUNTER", "DASHBOARD"] },
            data: { type: Type.OBJECT, properties: { productName: { type: Type.STRING } } },
            insights: {
              type: Type.OBJECT,
              properties: {
                marketTrend: { type: Type.STRING, enum: ["Green", "Yellow", "Red"] },
                competitionRisk: { type: Type.STRING, enum: ["Green", "Yellow", "Red"] },
                profitPotential: { type: Type.STRING, enum: ["Green", "Yellow", "Red"] },
                launchDifficulty: { type: Type.STRING, enum: ["Green", "Yellow", "Red"] },
              }
            },
            alerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  roi: { type: Type.STRING },
                }
              }
            }
          },
          required: ["text"],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  });
};
