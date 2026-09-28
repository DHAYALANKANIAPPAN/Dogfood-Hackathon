import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import Leaderboard from './pages/Leaderboard';
function App() {
  // Global mock state for the current logged-in role
  // Possible values: null, 'participant', 'judge', 'admin'
  const [role, setRole] = useState(null);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={!role ? <Auth setRole={setRole} /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/dashboard" 
          element={role ? <Dashboard role={role} setRole={setRole} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/gallery" 
          element={(role === 'admin' || role === 'judge') ? <Gallery /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/leaderboard" 
          element={role ? <Leaderboard /> : <Navigate to="/" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
