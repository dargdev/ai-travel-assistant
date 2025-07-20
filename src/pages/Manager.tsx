import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bg from '../assets/login-bg.png';

const BACKEND_API = 'http://localhost:4000';

type Traveler = {
  name: string;
  email: string;
  itinerary: string;
  status?: string;
};

export default function Manager() {
  const navigate = useNavigate();
  const [travelers, setTravelers] = useState<Traveler[]>([]);

  useEffect(() => {
    const fetchTravelers = async () => {
      try {
        const res = await fetch(`${BACKEND_API}/users`);
        const data = await res.json();
        setTravelers(data);
      } catch (err) {
        console.error('Failed to fetch travelers', err);
      }
    };

    fetchTravelers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleApprove = async (email: string) => {
    try {
      const res = await fetch(`${BACKEND_API}/users/${email}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        // Update traveler state locally
        setTravelers(prev =>
          prev.map(t => (t.email === email ? { ...t, status: 'approved' } : t)),
        );
      } else {
        alert('Failed to approve');
      }
    } catch {
      alert('Server error during approval');
    }
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

      <div className="w-[95%] h-[80vh] overflow-y-auto rounded-xl shadow-xl bg-white/70 backdrop-blur-md p-8">
        <h2 className="text-3xl font-bold text-rhino mb-6">
          Manager Dashboard
        </h2>

        {travelers.length === 0 ? (
          <p className="text-gray-600">No travelers found.</p>
        ) : (
          <div className="space-y-6">
            {travelers.map((traveler, index) => {
              const hasItinerary = !!traveler.itinerary;
              const isApproved = traveler.status === 'approved';
              console.log('traveler', traveler);

              return (
                <div
                  key={index}
                  className={`rounded-lg shadow p-6 border border-gray-200 ${
                    isApproved ? 'bg-green-100' : 'bg-white/80'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-lochinvar">
                        {traveler.name}
                      </h3>
                      <p className="text-sm text-gray-600">{traveler.email}</p>
                    </div>
                    {!isApproved ? (
                      <button
                        onClick={() => handleApprove(traveler.email)}
                        disabled={!hasItinerary}
                        className={`px-4 py-2 rounded transition text-white ${
                          hasItinerary
                            ? 'bg-lochinvar hover:bg-teal-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Approve Itinerary
                      </button>
                    ) : (
                      <span className="text-green-700 font-semibold bg-green-200 px-3 py-1 rounded">
                        Approved
                      </span>
                    )}
                  </div>

                  <div>
                    {hasItinerary ? (
                      (() => {
                        let parsed;
                        try {
                          parsed = JSON.parse(traveler.itinerary);
                        } catch {
                          return (
                            <p className="text-red-500">
                              Invalid itinerary format.
                            </p>
                          );
                        }

                        const title = parsed?.itinerary?.title;
                        const expenses = parsed?.expenses || [];

                        return (
                          <>
                            {/* Itinerary Summary */}
                            {title && (
                              <div className="prose max-w-none text-gray-800 mb-4">
                                {title}
                              </div>
                            )}

                            {/* Expenses Section */}
                            {expenses.length > 0 ? (
                              <div className="mt-4">
                                <h4 className="text-lg font-bold text-rhino mb-2">
                                  Expenses
                                </h4>
                                <ul className="text-gray-800 list-disc ml-6">
                                  {expenses.map((exp: any, idx: number) => (
                                    <li key={idx} className="mb-1">
                                      <span className="font-medium">
                                        {exp.description}
                                      </span>{' '}
                                      — <span>{exp.cost}</span>{' '}
                                      <span className="text-sm text-gray-500">
                                        ({exp.date_from} → {exp.date_to})
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">
                                No expenses listed.
                              </p>
                            )}
                          </>
                        );
                      })()
                    ) : (
                      <p className="text-gray-500 italic">
                        No itinerary submitted yet.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
