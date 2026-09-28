import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AnimatedDog = () => {
  return (
    <div className="relative w-48 h-48 mx-auto mb-10 flex items-center justify-center">
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full flex flex-col items-center justify-center"
      >
        {/* Ears */}
        <div className="absolute top-4 w-full flex justify-between px-6 z-0">
          <motion.div 
            animate={{ rotate: [-25, 0, -25] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="w-12 h-16 bg-primary-600 rounded-t-full rounded-bl-full origin-bottom shadow-inner border border-primary-500/50"
          />
          <motion.div 
            animate={{ rotate: [25, 0, 25] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.2 }}
            className="w-12 h-16 bg-primary-600 rounded-t-full rounded-br-full origin-bottom shadow-inner border border-primary-500/50"
          />
        </div>

        {/* Head Base */}
        <div className="relative w-40 h-36 bg-white rounded-[50px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-10 border-4 border-white/5">
          {/* Top colored mask */}
          <div className="absolute top-0 w-full h-20 bg-primary-600 rounded-b-[40px]"></div>
          
          {/* Eyes */}
          <div className="absolute top-12 w-full flex justify-between px-10">
            <motion.div 
              animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 0.5, 1] }}
              className="w-5 h-5 bg-[#111] rounded-full shadow-inner"
            />
            <motion.div 
              animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 0.5, 1] }}
              className="w-5 h-5 bg-[#111] rounded-full shadow-inner"
            />
          </div>

          {/* Snout Area */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-14 bg-zinc-100 rounded-full flex flex-col items-center shadow-inner">
            {/* Nose */}
            <div className="w-7 h-5 bg-[#111] rounded-[10px] mt-2 z-20 shadow-sm"></div>
            {/* Mouth line */}
            <div className="w-10 h-3 border-b-2 border-[#111]/20 rounded-b-full absolute top-6 z-20"></div>
            {/* Tongue */}
            <motion.div 
              animate={{ scaleY: [1, 1.4, 1], rotate: [-5, 5, -5] }}
              transition={{ duration: 0.25, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 bg-pink-500 rounded-b-full absolute top-7 origin-top z-10 shadow-md border border-pink-600/50"
            />
          </div>
        </div>
      </motion.div>

      {/* Shadow under dog */}
      <motion.div 
        animate={{ scale: [1, 0.8, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-black blur-md rounded-full z-[-1]"
      />
    </div>
  );
};

export default function Home({ role }) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#111] text-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl flex flex-col items-center"
      >
        <AnimatedDog />
        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight">
          Dogfood Hackathon
        </h1>
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
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
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm font-semibold transition-colors"
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
