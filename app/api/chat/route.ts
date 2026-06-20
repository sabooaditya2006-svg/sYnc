import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  // Here is where you will eventually put your AI connection code!
  return NextResponse.json({ reply: "You asked: " + prompt + ". I am a real-time bot now!" });
}
