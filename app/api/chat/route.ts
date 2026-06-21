import { GoogleGenAI } from "@google/genai";

// Initialize with the new client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // The new SDK uses the models interface
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash", // Ensure you use a current model
      contents: prompt,
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { reply: "Authentication failed. Ensure your API key is restricted to Gemini API only." }, 
      { status: 500 }
    );
  }
}
