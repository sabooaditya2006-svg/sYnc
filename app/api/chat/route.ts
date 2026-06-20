import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  console.log("API Key present:", !!process.env.GEMINI_API_KEY);
  try {
    const { prompt } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(
      `You are a helpful, compassionate assistant for someone with PMOS. Answer this question: ${prompt}`
    );
    
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { reply: "I'm having trouble connecting to my knowledge base right now. Please try again." }, 
      { status: 500 }
    );
  }
}
