'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) throw new Error('Failed to fetch response')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setAnalyzing(true)
    const userMessage = { role: 'user', content: `Analyzing website: ${url}` }
    setMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) throw new Error('Failed to analyze website')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      setUrl('')
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble analyzing that website. Please try again!' }])
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <main className="main-container">
      <Image
        src="/images/mikey.png"
        alt="Mikey - Your SEO Assistant"
        width={400}
        height={533}
        className="mikey-image"
        priority
      />
      
      <div className="content-container">
        <header className="header">
          <h1 className="title">MikeySEO</h1>
          <p className="subtitle">Your AI-Powered SEO Assistant</p>
        </header>

        <div className="chat-container">
          <div className="messages">
            {messages.length === 0 ? (
              <div className="empty-state">
                Hey there! I'm Mikey, your SEO expert. Start a conversation or analyze a website!
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.role === 'user' ? 'user-message' : 'assistant-message'
                  }`}
                >
                  {message.content}
                </div>
              ))
            )}
            {(loading || analyzing) && <div className="loading">Thinking...</div>}
          </div>

          <div className="input-container">
            <form onSubmit={handleAnalyze} className="analyze-form">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL to analyze..."
                className="input-field"
                disabled={analyzing || loading}
              />
              <button type="submit" className="analyze-button" disabled={analyzing || loading || !url.trim()}>
                Analyze
              </button>
            </form>

            <form onSubmit={handleSubmit} className="input-form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about SEO..."
                className="input-field"
                disabled={loading || analyzing}
              />
              <button type="submit" className="send-button" disabled={loading || analyzing || !input.trim()}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
} 