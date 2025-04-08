'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

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
          <p className="subtitle">Your AI SEO Assistant</p>
        </header>

        <div className="chat-container">
          <div className="messages">
            {messages.length === 0 ? (
              <div className="empty-state">
                Hey there! I'm Mikey, your SEO expert. How can I help you today?
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
            {loading && <div className="loading">Thinking...</div>}
          </div>

          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about SEO..."
              className="input-field"
              disabled={loading}
            />
            <button type="submit" className="send-button" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  )
} 