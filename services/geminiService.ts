import { GoogleGenAI } from "@google/genai";
import { ReactionResult } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing in process.env.API_KEY");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getEncouragement = async (recentResults: ReactionResult[]): Promise<string> => {
  const ai = getAIClient();
  
  // Basic validation and fallback
  if (!ai) return "你正在一天比一天更快哦！加油！";
  if (recentResults.length === 0) return "快去挑战一下，我已经准备好夸你啦！✨";

  const average = recentResults.reduce((acc, curr) => acc + curr.scoreMs, 0) / recentResults.length;
  const best = Math.min(...recentResults.map(r => r.scoreMs));

  const promptText = `
    Analyze these reaction times for a child (in milliseconds): ${recentResults.map(r => r.scoreMs).join(', ')}.
    Average: ${Math.round(average)}ms. Best: ${best}ms.
  `;

  const systemInstruction = `
    You are a friendly, enthusiastic AI coach for children. 
    Provide a very short, gentle, encouraging message (max 2 sentences) in Simplified Chinese. 
    Tone: Cute, warm, like a kindergarten teacher or a friendly mascot. Use emojis to make it fun.
    If they are fast (<300ms), praise their superhero speed. If slower, praise their amazing focus.
  `;

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [{ text: promptText }]
        },
        config: {
          systemInstruction: systemInstruction,
          maxOutputTokens: 100, // Prevent long responses
        }
      });
      
      const text = response.text;
      if (text) return text;
      
    } catch (error) {
      console.error(`Gemini API Error (Attempt ${attempts + 1}/${maxAttempts}):`, error);
      attempts++;
      // Exponential backoff: Wait 1s, then 2s...
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
  }

  // Graceful fallback if all retries fail
  return "专注力棒棒的！相信你下次会更快！💪";
};
