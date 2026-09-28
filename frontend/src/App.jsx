import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import Leaderboard from './pages/Leaderboard';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import PublicUsers from './pages/PublicUsers';
import PublicTeams from './pages/PublicTeams';
import Challenges from './pages/Challenges';

function App() {
  // Global mock state for the current logged-in role
  // Possible values: null, 'participant', 'judge', 'admin'
  const [role, setRole] = useState(null);

  const handleLogout = () => {
    setRole(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#111] text-white font-sans overflow-x-hidden">
        <Navbar role={role} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home role={role} />} />
          <Route path="/auth" element={!role ? <Auth setRole={setRole} /> : <Navigate to="/dashboard" replace />} />
          
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/dashboard" element={role ? <Dashboard role={role} setRole={setRole} /> : <Navigate to="/auth" replace />} />
          <Route path="/admin" element={role === 'admin' ? <Dashboard role={role} setRole={setRole} /> : <Navigate to="/" replace />} />
          <Route path="/judge" element={role === 'judge' ? <Dashboard role={role} setRole={setRole} /> : <Navigate to="/" replace />} />
          
          <Route path="/gallery" element={(role === 'admin' || role === 'judge') ? <Gallery /> : <Navigate to="/" replace />} />
          <Route path="/scoreboard" element={<Leaderboard />} />
          <Route path="/users" element={<PublicUsers />} />
          <Route path="/teams" element={<PublicTeams />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
