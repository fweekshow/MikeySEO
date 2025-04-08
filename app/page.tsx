'use client'

import React, { useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
  const [input, setInput] = useState('')
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await response.json()
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsAnalyzing(true)
    setMessages(prev => [...prev, { role: 'user', content: `Analyze this website: ${url}` }])

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json()
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      }
      setUrl('')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">MikeySEO</h1>
        <p className="subtitle">Your AI-Powered SEO Assistant</p>
      </header>

      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>Start a conversation with your SEO assistant or analyze a website...</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                {message.content}
              </div>
            ))
          )}
          {(isLoading || isAnalyzing) && (
            <div className="loading">
              {isAnalyzing ? 'Analyzing website...' : 'Thinking...'}
            </div>
          )}
        </div>

        <div className="input-container">
          <form onSubmit={handleAnalyze} className="input-form">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL to analyze..."
              className="input-field"
            />
            <button
              type="submit"
              disabled={isAnalyzing}
              className="send-button"
            >
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
            />
            <button
              type="submit"
              disabled={isLoading}
              className="send-button"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 