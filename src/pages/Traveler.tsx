import { useState } from 'react';
import bg from '../assets/login-bg.png';

const N8N_WEBHOOK_URL = 'https://n8n.narvaez.dev/webhook/ai-travel-agent';

export default function Traveler() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi! Please tell me: What is the purpose of your trip, which country you want to visit, and how many people are going?',
    },
  ]);
  const [input, setInput] = useState('');
  const [itinerary, setItinerary] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setItinerary(data.output.itinerary.summary);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: data.output.nextMessage || 'Sorry, I could not understand.',
        },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Something went wrong.' },
      ]);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-[90%] h-[90vh] flex rounded-xl shadow-xl bg-white/70 backdrop-blur-md overflow-hidden">
        {/* Chat Section */}
        <div className="w-2/3 flex flex-col p-6 border-r border-gray-300">
          <h2 className="text-2xl font-bold text-rhino mb-4">
            AI Travel Assistant
          </h2>
          <div className="flex-1 overflow-y-auto rounded bg-white/60 p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 p-3 rounded-lg shadow ${
                  msg.sender === 'user'
                    ? 'bg-lochinvar text-white self-end'
                    : 'bg-white border text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="mt-4 flex">
            <input
              type="text"
              className="flex-1 p-3 rounded-l-md border focus:outline-none"
              placeholder="Purpose, country, travelers..."
              value={input}
              onChange={e => setInput(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-lochinvar text-white px-5 rounded-r-md hover:bg-teal-700 transition"
            >
              Send
            </button>
          </form>
        </div>

        {/* Itinerary & Expenses Panel */}
        <div className="w-1/3 p-6 bg-white/60 backdrop-blur-md">
          <h3 className="text-xl font-semibold text-rhino mb-4">
            Trip Overview
          </h3>
          <div className="mb-6">
            <h4 className="font-bold text-lochinvar">Itinerary</h4>
            <div dangerouslySetInnerHTML={{ __html: itinerary }} />
          </div>
          {/* <div>
            <h4 className="font-bold text-lochinvar">Expenses</h4>
            <ul className="list-disc ml-5 text-gray-700">
              <li>Flight: $500</li>
              <li>Hotel: $300</li>
              <li>Meals: $150</li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  );
}
