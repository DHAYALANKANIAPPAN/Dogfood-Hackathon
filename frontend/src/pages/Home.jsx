import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedDog from '../components/AnimatedDog';

export default function Home({ role }) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl flex flex-col items-center"
      >
        <AnimatedDog className="mb-10" />
        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight">
          <span className="text-primary-600">Dogfood</span> <span className="text-red-500">Hackathon</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Welcome to the ultimate dogfooding event. Build, test, and break our own tools before they reach the customers.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          {!role ? (
            <>
              <Link 
                to="/auth?mode=register"
                className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-md text-sm font-semibold transition-colors"
              >
                Register Now
              </Link>
              <Link 
                to="/auth"
                className="px-8 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-md text-sm font-semibold transition-colors"
              >
                Login
              </Link>
            </>
          ) : (
            <Link 
              to="/challenges"
              className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-md text-sm font-semibold transition-colors"
            >
              Enter Event
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
