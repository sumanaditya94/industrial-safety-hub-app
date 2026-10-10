import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

// Use the 3.8 Flash model as requested for vision (nearest available is 1.5-flash)
const MODEL_NAME = "gemini-1.5-flash";

export const analyzeHazardImage = async (base64Image: string, mimeType: string, customPrompt?: string) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key is not set. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const defaultPrompt = `
    You are an expert EHS (Environment, Health, and Safety) Auditor.
    Analyze this image and identify:
    1. Any missing Personal Protective Equipment (PPE).
    2. Any unsafe acts or conditions.
    3. Potential OSHA or Indian Factories Act 1948 violations.
    Be concise and highlight high-risk items first.
  `;

  const prompt = customPrompt || defaultPrompt;
  const base64Data = base64Image.split(',')[1] || base64Image;

  const imageParts = [
    {
      inlineData: {
        data: base64Data,
        mimeType
      }
    }
  ];

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
