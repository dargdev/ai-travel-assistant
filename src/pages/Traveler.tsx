import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bg from '../assets/login-bg.png';
import { SimpleModal } from '../components/SuccessModal';

const N8N_WEBHOOK_URL = 'https://n8n.narvaez.dev/webhook/ai-travel-agent';
const BACKEND_API = 'http://localhost:4000';

export default function Traveler() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const email = user.email || '';
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi! Please tell me: What is the purpose of your trip, which country you want to visit, and how many people are going?',
    },
  ]);
  const [input, setInput] = useState('');
  const [itineraryHtml, setItineraryHtml] = useState<string | null>(null);
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, sessionId: email }),
      });
      const data = await res.json();
      setSelectedItinerary(data.output);

      // Extract itinerary
      if (data.output?.itinerary?.summary) {
        setItineraryHtml(data.output.itinerary.summary);
      }

      // Show next message
      if (data.output?.nextMessage || data.output?.itinerary) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text:
              data.output.nextMessage ||
              'I generated your itinerary. Let me know what to do next.',
          },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: data.nextMessage || 'Sorry, I could not understand.',
          },
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Something went wrong.' },
      ]);
    }
  };

  const handleSaveItinerary = async () => {
    try {
      const res = await fetch(`${BACKEND_API}/users/${email}/itinerary`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedItinerary),
      });
      if (res.ok) setShowModal(true);
      else alert('Failed to save.');
    } catch {
      alert('Server error.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-rhino text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        End Session
      </button>

      <div className="w-[90%] h-[80vh] flex rounded-xl shadow-xl bg-white/70 backdrop-blur-md overflow-hidden">
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

        {/* Itinerary Panel */}
        <div className="w-1/3 p-6 bg-white/60 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
          <div>
            <h3 className="text-xl font-semibold text-rhino mb-4">
              Itinerary Preview
            </h3>
            {itineraryHtml ? (
              <div
                className="text-gray-800 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: itineraryHtml }}
              />
            ) : (
              <p className="text-gray-500 italic">No itinerary yet.</p>
            )}
          </div>
          {itineraryHtml ? (
            <button
              onClick={handleSaveItinerary}
              className="mt-4 bg-marigold text-black font-semibold py-2 rounded hover:bg-yellow-400 transition"
            >
              Save Itinerary
            </button>
          ) : null}
        </div>
      </div>
      <SimpleModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
