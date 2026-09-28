import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Code2, ArrowRight, Calendar, MapPin, Trophy, Target } from 'lucide-react';
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
      {/* Cyberpunk Scanlines */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
      <div className="absolute top-[-100%] left-0 w-full h-8 bg-primary-500/30 blur-xl animate-scanline pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
        className="w-full max-w-4xl glass-panel rounded-3xl overflow-hidden flex flex-col md:flex-row relative z-10 neon-border"
        style={{ perspective: 1000 }}
      >
        <div className="md:w-1/2 p-12 flex flex-col justify-between bg-gradient-to-br from-primary-500/10 to-transparent border-r border-white/5 relative">
          <div>
            <motion.div 
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              className="w-16 h-16 bg-primary-500/20 border border-primary-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] mb-6 animate-float"
            >
              <Code2 className="w-8 h-8 text-primary-400" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold neon-text mb-4">Dogfood 2026</h1>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              Enter the grid. The ultimate offline-first hackathon environment. No external connections, pure code.
            </p>

            {/* Event Details Grid */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2, delayChildren: 0.3 }
                }
              }}
              className="grid grid-cols-1 gap-4 mb-8"
            >
              {[
                { icon: Calendar, title: "Operation Window", desc: "Oct 10 - 12, 2026 (72 Hours)", color: "text-primary-500", bg: "bg-primary-500/10", border: "border-primary-500/20" },
                { icon: MapPin, title: "Network Node", desc: "Silicon Valley Mainframe (Offline)", color: "text-primary-500", bg: "bg-primary-500/10", border: "border-primary-500/20" },
                { icon: Trophy, title: "Bounty Pool", desc: "$50,000 Grand Prize ($100k Total)", color: "text-secondary-500", bg: "bg-secondary-500/10", border: "border-secondary-500/30", glow: "shadow-[0_0_15px_rgba(255,0,60,0.1)]" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -50, rotateX: -30 },
                    visible: { 
                      opacity: 1, 
                      x: 0, 
                      rotateX: 0,
                      transition: { type: "spring", stiffness: 200, damping: 15 }
                    }
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    x: 10,
                    boxShadow: item.color === "text-secondary-500" ? "0 0 25px rgba(255,0,60,0.3)" : "0 0 20px rgba(0,240,255,0.2)",
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  className={`flex items-center gap-4 p-4 bg-black/40 border ${item.border} rounded-xl ${item.glow || ''} relative overflow-hidden group`}
                >
                  {/* Hover Scanline Effect inside Card */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[scanline-x_1.5s_ease-in-out_infinite]" />
                  
                  <motion.div 
                    whileHover={{ rotate: 180, scale: 1.2 }}
                    transition={{ type: "spring" }}
                    className={`p-3 ${item.bg} rounded-lg relative z-10`}
                  >
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </motion.div>
                  <div className="relative z-10">
                    <p className={`text-xs ${item.color.replace('text-', 'text-').replace('-500', '-500/70')} font-mono font-bold uppercase tracking-widest mb-1`}>{item.title}</p>
                    <p className="text-white font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="flex items-center gap-3 text-sm text-primary-400 font-medium tracking-widest uppercase"
            >
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              System Active & Accepting Registrations
            </motion.div>
          </div>
        </div>

        <div className="md:w-1/2 p-12 bg-black/40">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: 50, rotateY: 20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -50, rotateY: -20 }}
              transition={{ duration: 0.4 }}
              style={{ perspective: 1000 }}
            >
              <h2 className="text-3xl font-heading font-bold text-white mb-2 tracking-wide">
                {isLogin ? 'INITIATE_LOGIN' : 'CREATE_ENTITY'}
              </h2>
              <p className="text-primary-500/70 mb-8 font-mono text-sm">
                {isLogin ? '&gt; Awaiting credentials...' : '&gt; Register new node on the network'}
              </p>

              <form onSubmit={handleAuth} className="space-y-6">
                {!isLogin && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <label className="block text-xs font-mono font-bold text-primary-500 mb-2 uppercase tracking-widest">Entity Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-primary-500/50 group-focus-within:text-primary-500 transition-colors" />
                      </div>
                      <input name="fullName" type="text" required placeholder="User_404" className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-primary-500/30 rounded-xl text-white placeholder-zinc-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                    </div>
                  </motion.div>
                )}
                
                <div>
                  <label className="block text-xs font-mono font-bold text-primary-500 mb-2 uppercase tracking-widest">Data Link (Email)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-primary-500/50 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input name="email" type="email" required placeholder="user@network.local" className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-primary-500/30 rounded-xl text-white placeholder-zinc-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-primary-500 mb-2 uppercase tracking-widest">Access Code</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-primary-500/50 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input name="password" type="password" required placeholder="••••••••" className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-primary-500/30 rounded-xl text-white placeholder-zinc-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full py-4 mt-6 bg-primary-500 hover:bg-primary-400 text-bg-darker font-bold rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all flex items-center justify-center gap-2 group tracking-wider uppercase font-heading"
                >
                  {isLogin ? 'EXECUTE' : 'INITIALIZE'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-zinc-400 hover:text-primary-400 text-sm font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
            <p className="text-xs text-zinc-600 mt-4 max-w-[300px] mx-auto leading-relaxed">
              <strong>Demo Logins:</strong><br />
              Admin: admin@dogfood.com / admin123<br />
              Judge: judge1@dogfood.com / judge123<br />
              Participant: p1@dogfood.com / p123<br />
              <em>Or switch to "Sign Up" to create a new user.</em>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
