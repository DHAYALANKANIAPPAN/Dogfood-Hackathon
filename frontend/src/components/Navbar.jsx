import { Link, useLocation } from 'react-router-dom';
import { Dog } from 'lucide-react';

export default function Navbar({ role, onLogout }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "text-text-main neon-text" : "text-text-muted hover:text-text-main";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-bg-dark border-b border-primary-500 font-mono text-sm uppercase tracking-widest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg tracking-wide">
              <span className="text-primary-500">DOGFOOD</span><span className="text-secondary-500">®</span>
            </Link>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-6 text-sm font-medium">
                {role && (
                  <>
                    <Link to="/users" className={`transition-colors ${isActive('/users')}`}>Users</Link>
                    <Link to="/teams" className={`transition-colors ${isActive('/teams')}`}>Teams</Link>
                    <Link to="/challenges" className={`transition-colors ${isActive('/challenges')}`}>Challenges</Link>
                  </>
                )}
                <Link to="/gallery" className={`transition-colors ${isActive('/gallery')}`}>Gallery</Link>
                <Link to="/scoreboard" className={`transition-colors ${isActive('/scoreboard')}`}>Scoreboard</Link>
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
                  <button onClick={onLogout} className="text-secondary-500 hover:text-secondary-400 transition-colors uppercase tracking-widest">Logout</button>
                </>
              ) : (
                  <Link to="/auth" className={`transition-colors ${isActive('/auth')}`}>Login</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
