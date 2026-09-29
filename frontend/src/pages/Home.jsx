import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AnimatedDog from '../components/AnimatedDog';
import { Code, Database } from 'lucide-react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg-dark text-text-main flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
             backgroundSize: '40px 40px' 
           }} 
      />
      
      {/* Interactive Glow effect following mouse */}
      <motion.div 
        className="absolute w-[500px] h-[500px] rounded-full bg-primary-500/10 blur-[100px] pointer-events-none z-0 hidden lg:block"
        animate={{
          x: mousePosition.x - 250,
          y: mousePosition.y - 250,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      />
      <motion.div 
        className="absolute w-[400px] h-[400px] rounded-full bg-secondary-500/10 blur-[80px] pointer-events-none z-0 hidden lg:block"
        animate={{
          x: mousePosition.x - 200 + 150,
          y: mousePosition.y - 200 - 100,
        }}
        transition={{ type: "tween", ease: "circOut", duration: 0.7 }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 py-12">
        
        {/* Left Side: Hero Title */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-left w-full"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tighter mb-6 leading-[0.9]">
            <span className="block text-primary-500 drop-shadow-sm mb-2">DOGFOOD</span>
            <span className="block text-secondary-500 drop-shadow-sm">HACKATHON</span>
          </h1>
          
          <div className="mt-10 border-l-4 border-primary-500 pl-6 py-2">
            <p className="text-lg md:text-2xl text-text-muted max-w-lg font-mono font-bold uppercase tracking-widest leading-relaxed">
              Learn. Build. Sleep. Repeat.
            </p>
          </div>
        </motion.div>

        {/* Right Side: Visual Element & Stats */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex-1 w-full max-w-lg relative"
        >
          {/* Abstract shadow/glow behind the card */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 via-transparent to-secondary-500/20 rounded-3xl transform rotate-3 scale-105 blur-xl -z-10" />
          
          <div className="bg-bg-darker/80 backdrop-blur-xl border border-bg-card shadow-2xl p-10 rounded-2xl relative overflow-hidden group hover:border-primary-500/50 transition-colors duration-500">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary-500 rounded-tl-xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-secondary-500 rounded-br-xl opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-center mb-12 transform group-hover:scale-105 transition-transform duration-500">
              <AnimatedDog />
            </div>

            <div className="grid grid-cols-2 gap-6 relative z-10">
              <div className="flex flex-col items-center justify-center p-6 bg-bg-dark border border-bg-card rounded-xl hover:border-primary-500 transition-colors shadow-sm">
                <Database className="w-8 h-8 text-primary-500 mb-3" />
                <span className="text-3xl font-black font-heading text-text-main">72h</span>
                <span className="text-xs font-mono text-text-muted uppercase tracking-widest mt-1">Countdown</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-bg-dark border border-bg-card rounded-xl hover:border-secondary-500 transition-colors shadow-sm">
                <Code className="w-8 h-8 text-secondary-500 mb-3" />
                <span className="text-3xl font-black font-heading text-text-main">OSI</span>
                <span className="text-xs font-mono text-text-muted uppercase tracking-widest mt-1">License</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Elements Background */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary-500/40 rounded-none transform rotate-45"
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            opacity: Math.random() * 0.5 + 0.2,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            y: [null, -100],
            opacity: [null, 0],
            rotate: [45, 135]
          }}
          transition={{
            duration: Math.random() * 8 + 7,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
