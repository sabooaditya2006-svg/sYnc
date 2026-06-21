import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize the client once at the top level
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // The new SDK uses ai.models.generateContent
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash", // gemini-3.5-flash is the current stable model
      contents: prompt,
    });

    // Access the text using .text directly
    return NextResponse.json({ reply: response.text });
    
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { reply: "Failed to generate content. Please check your API key configuration." }, 
      { status: 500 }
    );
  }
}
