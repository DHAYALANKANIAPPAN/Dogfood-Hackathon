import { motion } from 'framer-motion';

export default function AnimatedDog({ className = "" }) {
  return (
    <div className={`relative w-64 h-64 mx-auto flex items-center justify-center ${className}`}>
      {/* Contrasting background blob behind the logo */}
      <div className="absolute inset-0 bg-primary-600/10 rounded-full blur-3xl animate-pulse"></div>
      
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
        <div className="relative w-40 h-36 bg-white rounded-[50px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-10 border-4 border-slate-200">
          {/* Top colored mask */}
          <div className="absolute top-0 w-full h-20 bg-primary-600 rounded-b-[40px]"></div>
          
          {/* Eyes */}
          <div className="absolute top-12 w-full flex justify-between px-10">
            <motion.div 
              animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 0.5, 1] }}
              className="w-5 h-5 bg-slate-900 rounded-full shadow-inner"
            />
            <motion.div 
              animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 0.5, 1] }}
              className="w-5 h-5 bg-slate-900 rounded-full shadow-inner"
            />
          </div>

          {/* Snout Area */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-14 bg-slate-100 rounded-full flex flex-col items-center shadow-inner">
            {/* Nose */}
            <div className="w-7 h-5 bg-slate-900 rounded-[10px] mt-2 z-20 shadow-sm"></div>
            {/* Mouth line */}
            <div className="w-10 h-3 border-b-2 border-slate-900/20 rounded-b-full absolute top-6 z-20"></div>
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
}
