import { useState, useEffect } from 'react';
import { Search, Code2, Play, GitBranch, ExternalLink, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Gallery() {
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetch('http://localhost:8000/api/data/projects', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProjects((data || []).filter(p => p.status !== 'Draft').map(p => ({
          ...p,
          tagline: p.description ? p.description.substring(0, 50) + '...' : 'Hackathon Project',
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=400',
          track: 'Main Track'
        })));
      })
      .catch(err => console.error(err));
  }, []);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.tagline.toLowerCase().includes(search.toLowerCase()) ||
    p.track.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-bg-darker text-white font-sans selection:bg-primary-500 selection:text-black pb-20 relative overflow-x-hidden"
    >
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
      <div className="absolute top-[-100%] right-[-10%] w-[50%] h-[50%] bg-primary-600/10 blur-[150px] rounded-full mix-blend-screen animate-blob" />
      <div className="absolute bottom-[-100%] left-[-10%] w-[40%] h-[40%] bg-secondary-600/10 blur-[150px] rounded-full mix-blend-screen animate-blob animation-delay-2000" />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-primary-500/20 bg-black/60 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div 
              className="w-10 h-10 rounded-sm bg-primary-500/20 border border-primary-500 flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.2)] group-hover:bg-primary-500 transition-colors"
            >
              <Code2 className="w-5 h-5 text-primary-500 group-hover:text-black transition-colors" />
            </div>
            <span className="text-xl neon-text tracking-widest uppercase">Dogfood_OS</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Login / Register</Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-500/10 border border-secondary-500/50 text-secondary-500 text-xs font-mono font-bold uppercase tracking-widest mb-6"
          >
            <Star className="w-4 h-4" /> PUBLIC_ARCHIVE
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-bold mb-6 neon-text uppercase tracking-tight"
          >
            Explore the Grid
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-primary-200/60 font-mono max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            &gt; INDEXING COMPLETED SUBMISSIONS...<br/>
            &gt; ACCESSING OPEN-SOURCE PROTOCOLS...
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto relative group"
          >
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-primary-500/50 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Query database..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-14 pr-6 py-4 bg-black/40 border border-primary-500/30 rounded-none text-white placeholder-zinc-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] font-mono text-sm"
            />
          </motion.div>
        </div>

        {/* Gallery Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {filteredProjects.map(project => (
            <motion.div 
              variants={itemVariants}
              key={project.id} 
              className="glass-panel neon-border p-0 flex flex-col group"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={project.image} 
                  alt={project.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-darker via-bg-darker/80 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                <div className="absolute bottom-4 left-6 flex items-center gap-3">
                  <span className="px-3 py-1 bg-black/60 border border-primary-500/50 text-xs font-mono font-bold text-primary-400 uppercase tracking-widest shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                    {project.track}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col relative z-10 -mt-10">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-white mb-1 group-hover:text-primary-400 transition-colors uppercase tracking-tight">{project.name}</h3>
                    <p className="text-primary-500/70 text-xs font-mono font-bold uppercase tracking-wider">{project.tagline}</p>
                  </div>
                  <div className="flex gap-2">
                    {project.repo_url && (
                      <a href={project.repo_url} target="_blank" rel="noreferrer" className="p-2 bg-black/50 border border-primary-500/30 hover:border-primary-500 transition-colors text-primary-400 hover:text-primary-300" title="Source">
                        <GitBranch className="w-5 h-5" />
                      </a>
                    )}
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noreferrer" className="p-2 bg-secondary-500 hover:bg-secondary-400 transition-colors text-white shadow-[0_0_10px_rgba(255,0,60,0.3)] border border-secondary-400" title="Execute Demo">
                        <Play className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
                
                <p className="text-zinc-400 leading-relaxed mb-6 flex-1 text-sm">
                  {project.description}
                </p>
                
                <div className="pt-6 border-t border-primary-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black/50 flex items-center justify-center border border-primary-500/30">
                      <Users className="w-4 h-4 text-primary-500" />
                    </div>
                    <span className="text-xs font-mono font-bold text-primary-200 uppercase tracking-widest">{project.team}</span>
                  </div>
                  <a href="#" className="text-xs font-mono font-bold text-secondary-500 hover:text-secondary-400 transition-colors flex items-center gap-1 group/link uppercase tracking-widest">
                    Access <ExternalLink className="w-3 h-3 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass-panel neon-border"
          >
            <Search className="w-12 h-12 text-primary-500/50 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-primary-400 mb-2 uppercase tracking-widest">NO_RECORDS_FOUND</h3>
            <p className="text-primary-500/50 font-mono text-sm">&gt; Modify query parameters.</p>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
