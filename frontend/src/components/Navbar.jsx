import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dog } from 'lucide-react';

export default function Navbar({ role, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? "text-white" : "text-zinc-400 hover:text-white";
  };

  const handleLogout = () => {
    onLogout();
    navigate('/auth');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#1A1A1A] border-b border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-white font-heading font-bold text-lg tracking-wide">
              <Dog className="w-5 h-5 text-primary-500" />
              DOGFOOD
            </Link>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-6 text-sm font-medium">
                <Link to="/users" className={`transition-colors ${isActive('/users')}`}>Users</Link>
                <Link to="/teams" className={`transition-colors ${isActive('/teams')}`}>Teams</Link>
                <Link to="/scoreboard" className={`transition-colors ${isActive('/scoreboard')}`}>Scoreboard</Link>
                <Link to="/challenges" className={`transition-colors ${isActive('/challenges')}`}>Challenges</Link>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-6 text-sm font-medium">
              {role ? (
                <>
                  {role === 'admin' && (
                    <Link to="/admin" className={`transition-colors ${isActive('/admin')}`}>Admin</Link>
                  )}
                  {role === 'judge' && (
                    <Link to="/judge" className={`transition-colors ${isActive('/judge')}`}>Judging</Link>
                  )}
                  {role === 'participant' && (
                    <Link to="/dashboard" className={`transition-colors ${isActive('/dashboard')}`}>Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="text-zinc-400 hover:text-white transition-colors">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/auth?mode=register" className={`transition-colors ${isActive('/auth?mode=register')}`}>Register</Link>
                  <Link to="/auth" className={`transition-colors ${isActive('/auth')}`}>Login</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
