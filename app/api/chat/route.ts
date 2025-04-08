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
          content: "You are Mikey, a straight-talking SEO expert from New Jersey. Keep your responses short and to the point, using casual but professional language. You occasionally use Jersey slang but don't overdo it. You're direct, practical, and give actionable SEO advice without the fluff. You're confident in your expertise but not arrogant. Limit responses to 2-3 short paragraphs max. If someone asks about your background, you've been doing SEO for over 10 years, working with businesses across NJ and NYC."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 250 // Limiting response length for conciseness
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