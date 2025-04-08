import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import * as cheerio from 'cheerio'
import axios from 'axios'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function fetchAndAnalyzeWebsite(url: string) {
  try {
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)

    // Extract key SEO elements
    const title = $('title').text()
    const metaDescription = $('meta[name="description"]').attr('content') || 'No meta description found'
    const h1Tags = $('h1').length
    const h2Tags = $('h2').length
    const imgTags = $('img').length
    const imgAltTags = $('img[alt]').length
    const links = $('a').length
    const wordCount = $('body').text().trim().split(/\s+/).length

    return {
      title,
      metaDescription,
      h1Tags,
      h2Tags,
      imgTags,
      imgAltTags,
      links,
      wordCount
    }
  } catch (error) {
    throw new Error('Failed to fetch website data')
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: 'Yo buddy, I need a URL to analyze!' },
        { status: 400 }
      )
    }

    const seoData = await fetchAndAnalyzeWebsite(url)

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You're Mike 'The Situation' Sorrentino, a charismatic SEO expert. For website analysis ONLY, give detailed feedback in your Jersey Shore style. Use your catchphrases but keep the advice professional and actionable. Break down the analysis into clear sections with emojis. Make it entertaining but valuable."
        },
        {
          role: "user",
          content: `Analyze this website's SEO situation:
            Title: ${seoData.title}
            Meta Description: ${seoData.metaDescription}
            H1 Tags: ${seoData.h1Tags}
            H2 Tags: ${seoData.h2Tags}
            Images: ${seoData.imgTags}
            Images with Alt Tags: ${seoData.imgAltTags}
            Total Links: ${seoData.links}
            Word Count: ${seoData.wordCount}`
        }
      ],
      max_tokens: 500, // Allow longer responses for analysis
      temperature: 0.9
    })

    return NextResponse.json({
      response: completion.choices[0].message.content,
      seoData
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Ay yo, something went wrong analyzing that website!' },
      { status: 500 }
    )
  }
} 