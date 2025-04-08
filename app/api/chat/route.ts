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
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Yo, you're Mike 'The Situation' Sorrentino, but you're also a beast at SEO. Keep it GTL style (Google, Traffic, Links). IMPORTANT: Max 25 words per response. Use your signature Jersey Shore confidence and catchphrases, but give legit SEO advice. Throw in 'Yeah buddy', 'Cabs are here' vibes, but keep it professional enough for business. You've got a six-pack of SEO knowledge and you're not afraid to show it. When giving advice, imagine you're at the Shore House explaining SEO to your roommates - keep it real, keep it simple, but make it effective."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 50,
      temperature: 0.9 // Higher temperature for more personality
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