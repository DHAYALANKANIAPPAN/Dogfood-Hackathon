import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedDog from '../components/AnimatedDog';
import Rules from '../components/Rules';

export default function Home({ role }) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg-dark text-text-main flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Scanlines effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,229,208,0.2)_3px,rgba(0,229,208,0.2)_4px)]" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl flex flex-col items-center"
      >
        <AnimatedDog className="mb-10" />
        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight neon-text">
          <span className="text-primary-500">Dogfood</span> <span className="text-secondary-500">Hackathon</span>
        </h1>
        <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed font-mono-vt tracking-widest uppercase">
          Build the platform that will judge you.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          {!role ? (
            <>
              <Link 
                to="/auth?mode=register"
                className="px-8 py-3 bg-secondary-500 hover:bg-secondary-400 text-bg-dark rounded-none border border-secondary-500 text-sm font-bold font-mono tracking-widest uppercase transition-colors"
              >
                Register Now
              </Link>
              <Link 
                to="/auth"
                className="px-8 py-3 bg-transparent hover:bg-bg-card border border-primary-500 text-primary-500 rounded-none text-sm font-bold font-mono tracking-widest uppercase transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/gallery"
                className="px-8 py-3 bg-transparent hover:bg-bg-card border border-primary-500 text-primary-500 rounded-none text-sm font-bold font-mono tracking-widest uppercase transition-colors"
              >
                View Gallery
              </Link>
            </>
          ) : (
            <Link 
              to="/challenges"
              className="px-8 py-3 bg-secondary-500 hover:bg-secondary-400 text-bg-dark rounded-none border border-secondary-500 text-sm font-bold font-mono tracking-widest uppercase transition-colors"
            >
              Enter Event
            </Link>
          )}
        </div>
      </motion.div>
      
      <div className="w-full max-w-7xl mx-auto px-6 mt-16">
        <Rules />
      </div>
    </div>
  );
}
