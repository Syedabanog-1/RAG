import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'dummy_key',
  });

  try {
    const { question, context, topic, history } = await req.json();

    const systemPrompt = `
      You are an expert AI tutor specializing in Retrieval-Augmented Generation (RAG).
      The user is currently learning about the topic: "${topic}".
      The current slide explanation is: "${context}".
      
      Your task:
      1. Answer the user's question accurately based on the current context and your expert knowledge of RAG.
      2. Keep answers concise, helpful, and professional.
      3. Use simple language so the student can understand complex concepts.
      4. If the user asks in Urdu/Hindi, reply in ROMAN URDU (English letters).
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: question }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 500,
    });

    const answer = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}
