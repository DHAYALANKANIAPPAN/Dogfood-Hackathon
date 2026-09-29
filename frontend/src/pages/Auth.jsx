import { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Code2, Dog, ArrowRight, Calendar, MapPin, Trophy, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedDog from '../components/AnimatedDog';

export default function Auth({ setRole }) {
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });

      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      const payload = JSON.parse(atob(data.access_token.split('.')[1]));
      let decodedRole = String(payload.role).toLowerCase();
      if (decodedRole.includes('admin')) decodedRole = 'admin';
      else if (decodedRole.includes('judge')) decodedRole = 'judge';
      else if (decodedRole.includes('participant')) decodedRole = 'participant';
      setRole(decodedRole);
      navigate('/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed. Make sure the backend server is running on port 8000.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-100 flex items-center justify-center p-6 relative overflow-hidden"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white shadow-xl border border-slate-200 rounded-3xl overflow-hidden flex flex-col md:flex-row relative z-10"
      >
        <div className="md:w-1/2 p-12 flex flex-col justify-between bg-white border-r border-slate-200 relative overflow-hidden">
          {/* Animated Dog Background watermark */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.08] pointer-events-none scale-150 -translate-x-12 translate-y-12">
            <AnimatedDog className="" />
          </div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center mb-8">
              <Dog className="w-6 h-6 text-primary-600" />
            </div>
            <h1 className="text-4xl font-heading font-semibold mb-4 tracking-tight">
              <span className="text-primary-600">DOGFOOD</span> <span className="text-red-500">Hackathon 2026</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              Join the brightest minds to build the future. 72 hours of intense coding, collaboration, and innovation.
            </p>

            {/* Event Details Grid */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                }
              }}
              className="grid grid-cols-1 gap-4 mb-8"
            >
              {[
                { icon: Calendar, title: "When", desc: "Oct 10 - 12, 2026", color: "text-primary-600" },
                { icon: MapPin, title: "Where", desc: "Silicon Valley Campus", color: "text-primary-600" },
                { icon: Trophy, title: "Prize Pool", desc: "$50,000 Grand Prize", color: "text-secondary-400" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { ease: "easeOut" } }
                  }}
                  className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:bg-white/[0.04] transition-colors"
                >
                  <div className="p-2.5 bg-slate-50 rounded-lg">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">{item.title}</p>
                    <p className="text-slate-800 font-medium text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Registration Open
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-12 bg-slate-100 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-heading font-semibold text-primary-600 mb-2">
                Welcome back
              </h2>
              <p className="text-slate-600 mb-8 text-sm">
                Enter your details to sign in to your account
              </p>

              <form onSubmit={handleAuth} className="space-y-5">
                
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-primary-600 transition-colors" />
                    </div>
                    <input name="email" type="email" required placeholder="name@company.com" className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-primary-600 transition-colors" />
                    </div>
                    <input name="password" type="password" required placeholder="••••••••" className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 mt-6 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 group text-sm"
                >
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 text-center">
            <div className="mt-6 p-4 bg-white border border-slate-200 rounded-xl inline-block text-left mx-auto">
              <p className="text-xs text-slate-500 leading-relaxed font-mono">
                <strong className="text-slate-700 font-sans">Demo Accounts:</strong><br />
                admin@dogfood.com / admin123<br />
                judge1@dogfood.com / judge123<br />
                p1@dogfood.com / p123
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
