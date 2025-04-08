import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are Mikey, a no-nonsense SEO expert from Jersey. IMPORTANT: Keep ALL responses under 25 words - no exceptions. Be direct and practical. Use casual but professional tone. Give quick, actionable SEO advice."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 50, // This helps ensure very concise responses
      temperature: 0.7
    })

    return NextResponse.json({
      response: completion.choices[0].message.content
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'There was an error processing your request' },
      { status: 500 }
    )
  }
} 