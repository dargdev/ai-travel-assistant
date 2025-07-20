// src/App.tsx
import React, { useState } from 'react';
import './App.css';

const N8N_WEBHOOK_URL = 'https://n8n.narvaez.dev/webhook/ai-travel-agent';
function App() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi! I'm your AI travel assistant. Ask me anything!",
    },
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: data.output || "I didn't get that." },
      ]);
      console.log('Response from n8n:', data);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Something went wrong.' },
      ]);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>AI Travel & Expense Assistant</h1>
        <p>Plan your trip & track your spending with AI</p>
      </header>
      <main>
        <section className="chatbox">
          <div className="chat-log">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about itinerary, restaurants, expenses..."
              required
            />
            <button type="submit">Send</button>
          </form>
        </section>
      </main>
      <footer>
        <p>Powered by n8n & OpenAI</p>
      </footer>
    </div>
  );
}

export default App;
