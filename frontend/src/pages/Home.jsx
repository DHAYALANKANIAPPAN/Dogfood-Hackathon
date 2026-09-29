import { motion } from 'framer-motion';
import AnimatedDog from '../components/AnimatedDog';

export default function Home() {
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
      </motion.div>
    </div>
  );
}
