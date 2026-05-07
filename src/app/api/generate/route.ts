import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic, context, language } = await req.json();

    const prompt = `
      You are a professional teacher. Explain and translate the following RAG topic: "${topic}"
      Points to cover: ${context.join(', ')}
      Target Language: ${language}
      
      CRITICAL RULES:
      1. If Language is Urdu, you MUST use **ROMAN URDU** (English letters ONLY, e.g., 'RAG ek aisi technology hai...'). 
      2. DO NOT USE URDU SCRIPT (No Arabic characters).
      3. Explain technical terms in simple Roman Urdu so a student can understand easily.
      4. Return ONLY a VALID JSON object:
      {
        "explanation": "Detailed explanation in ${language}",
        "translatedContent": ["Point 1 in ${language}", "Point 2 in ${language}", ...]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.6,
      response_format: { type: "json_object" }
    });

    let data;
    try {
      data = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
    } catch (e) {
      console.error("JSON Parse Error:", e);
      data = { explanation: "AI response error. Please try again.", translatedContent: context };
    }

    return NextResponse.json({ 
      explanation: data.explanation || "Explanation loading...",
      translatedContent: data.translatedContent || context
    });
  } catch (error) {
    console.error('Groq Error:', error);
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
  }
}
