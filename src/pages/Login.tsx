// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg'; // Make sure this file exists
import bg from '../assets/login-bg.png'; // Your background image

const hardcodedUsers = [
  { email: 'traveler@demo.com', password: 'traveler123', role: 'traveler' },
  { email: 'manager@demo.com', password: 'manager123', role: 'manager' },
];

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = () => {
    const user = hardcodedUsers.find(
      u => u.email === form.email && u.password === form.password,
    );
    if (user) {
      localStorage.setItem('role', user.role);
      navigate(`/${user.role}`);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <img src={logo} alt="Logo" className="mx-auto mb-6 w-28" />
        <h2 className="text-2xl font-bold text-center text-rhino mb-2">
          Login
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Ready for your trip? Sign in to plan and manage your travel itinerary
          and expenses.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lochinvar"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lochinvar"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-lochinvar text-white py-2 rounded hover:bg-teal-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
