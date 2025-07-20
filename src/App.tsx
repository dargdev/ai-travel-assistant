import { Routes, Route } from 'react-router-dom';
import Traveler from './pages/Traveler';
import Login from './pages/Login';
import Manager from './pages/Manager';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/traveler" element={<Traveler />} />
      <Route path="/manager" element={<Manager />} />
    </Routes>
  );
}

export default App;
