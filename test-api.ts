import { GoogleGenAI } from "@google/genai";
const apiKey = process.env.GEMINI_API_KEY;

async function test() {
  console.log("Checking key:", apiKey ? "Key exists" : "Key is missing");
  if (!apiKey) return;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Hello",
    });
    console.log("API Success!");
  } catch (e) {
    console.error("API Failure:", e);
  }
}
test();