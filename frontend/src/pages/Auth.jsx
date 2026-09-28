import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Code2, Dog, ArrowRight, Calendar, MapPin, Trophy, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth({ setRole }) {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      if (isLogin) {
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
      } else {
        const fullName = e.target.fullName.value;
        let determinedRole = 'participant';
        if (email.includes('admin')) determinedRole = 'admin';
        else if (email.includes('judge')) determinedRole = 'judge';

        const response = await fetch('http://localhost:8000/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, full_name: fullName, role: determinedRole })
        });

        if (!response.ok) throw new Error('Registration failed');
        
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        const loginRes = await fetch('http://localhost:8000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });
        const data = await loginRes.json();
        localStorage.setItem('access_token', data.access_token);
        const payload = JSON.parse(atob(data.access_token.split('.')[1]));
        let decodedRole = String(payload.role).toLowerCase();
        if (decodedRole.includes('admin')) decodedRole = 'admin';
        else if (decodedRole.includes('judge')) decodedRole = 'judge';
        else if (decodedRole.includes('participant')) decodedRole = 'participant';
        setRole(decodedRole);
        navigate('/dashboard');
      }
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
      className="min-h-screen bg-bg-darker flex items-center justify-center p-6 relative overflow-hidden"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl glass-panel rounded-3xl overflow-hidden flex flex-col md:flex-row relative z-10"
      >
        <div className="md:w-1/2 p-12 flex flex-col justify-between bg-white/[0.02] border-r border-white/[0.05] relative">
          <div>
            <div className="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center mb-8">
              <Dog className="w-6 h-6 text-primary-400" />
            </div>
            <h1 className="text-4xl font-heading font-semibold text-white mb-4">DOGFOOD Hackathon 2026</h1>
            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
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
                { icon: Calendar, title: "When", desc: "Oct 10 - 12, 2026", color: "text-primary-400" },
                { icon: MapPin, title: "Where", desc: "Silicon Valley Campus", color: "text-primary-400" },
                { icon: Trophy, title: "Prize Pool", desc: "$50,000 Grand Prize", color: "text-secondary-400" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { ease: "easeOut" } }
                  }}
                  className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] transition-colors"
                >
                  <div className="p-2.5 bg-white/[0.03] rounded-lg">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-0.5">{item.title}</p>
                    <p className="text-zinc-200 font-medium text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Registration Open
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-12 bg-black/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-heading font-semibold text-white mb-2">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-zinc-400 mb-8 text-sm">
                {isLogin ? 'Enter your details to sign in to your account' : 'Sign up to register for the hackathon'}
              </p>

              <form onSubmit={handleAuth} className="space-y-5">
                {!isLogin && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-zinc-500 group-focus-within:text-primary-400 transition-colors" />
                      </div>
                      <input name="fullName" type="text" required placeholder="Jane Doe" className="block w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm" />
                    </div>
                  </motion.div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-zinc-500 group-focus-within:text-primary-400 transition-colors" />
                    </div>
                    <input name="email" type="email" required placeholder="name@company.com" className="block w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-zinc-500 group-focus-within:text-primary-400 transition-colors" />
                    </div>
                    <input name="password" type="password" required placeholder="••••••••" className="block w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 mt-6 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 group text-sm"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-zinc-400 hover:text-white text-sm transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
            <div className="mt-6 p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl inline-block text-left mx-auto">
              <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                <strong className="text-zinc-300 font-sans">Demo Accounts:</strong><br />
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
