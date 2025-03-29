import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System context for the AI assistant
const SYSTEM_CONTEXT = `You are a helpful AI assistant for a medical image analysis application. Your role is to help users understand their medical image analysis results and answer questions about cancer detection. You should be empathetic, professional, and focused on providing accurate information.

Key capabilities:
1. Explaining analysis results and confidence levels
2. Providing information about different types of cancer
3. Answering questions about the analysis process
4. Offering guidance on next steps after receiving results

Guidelines:
- Be clear and concise in your explanations
- Use medical terminology appropriately but explain complex terms
- Maintain a supportive and professional tone
- Focus on factual information and avoid speculation
- Encourage users to consult healthcare professionals for medical decisions`;

export async function POST(req: Request) {
  try {
    const { message, messages } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Start with system context
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_CONTEXT }] }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Add user messages history (excluding system messages)
    const userMessages = messages
      .filter((msg: { role: string }) => msg.role !== 'system')
      .map((msg: { role: string; content: string }) => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

    // Send the current message
    const result = await chat.sendMessageStream(message);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(`data: ${JSON.stringify({ text })}\n\n`);
            }
          }
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
} 