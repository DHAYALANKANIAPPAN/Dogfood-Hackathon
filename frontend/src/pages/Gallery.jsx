import { useState, useEffect } from 'react';
import { Search, Code2, Play, GitBranch, ExternalLink, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScoringModal from '../components/ScoringModal';

export default function Gallery({ role }) {
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [scoringAssignment, setScoringAssignment] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    // Fetch Projects
    fetch('http://localhost:8000/api/data/projects', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProjects((data || []).filter(p => p.status !== 'Draft').map(p => ({
          ...p,
          tagline: p.description ? p.description.substring(0, 50) + '...' : 'Hackathon Project'
        })));
      })
      .catch(err => console.error(err));

    // Fetch Assignments if Judge
    if (role === 'judge') {
      fetch('http://localhost:8000/api/data/assignments', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setAssignments(data || []))
        .catch(err => console.error(err));
    }
  }, [role]);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.tagline.toLowerCase().includes(search.toLowerCase())
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
      className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-500 selection:text-black pb-20 relative overflow-x-hidden"
    >
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
      {/* Removed duplicate navigation to rely on App.jsx Navbar */}

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
            className="text-lg text-primary-800/60 font-mono max-w-2xl mx-auto mb-10 leading-relaxed"
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
              className="block w-full pl-14 pr-6 py-4 bg-black/40 border border-primary-500/30 rounded-none text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] font-mono text-sm"
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
              <div className="p-8 flex-1 flex flex-col relative z-10">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{project.name}</h3>
                    <p className="text-primary-500/70 text-xs font-mono font-bold uppercase tracking-wider">{project.tagline}</p>
                  </div>
                  <div className="flex gap-2">
                    {project.repo_url && (
                      <a href={project.repo_url} target="_blank" rel="noreferrer" className="p-2 bg-black/50 border border-primary-500/30 hover:border-primary-500 transition-colors text-primary-600 hover:text-primary-300" title="Source">
                        <GitBranch className="w-5 h-5" />
                      </a>
                    )}
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noreferrer" className="p-2 bg-secondary-500 hover:bg-secondary-400 transition-colors text-slate-900 shadow-[0_0_10px_rgba(255,0,60,0.3)] border border-secondary-400" title="Execute Demo">
                        <Play className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
                
                <p className="text-slate-600 leading-relaxed mb-6 flex-1 text-sm">
                  {project.description}
                </p>
                
                <div className="pt-6 border-t border-primary-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black/50 flex items-center justify-center border border-primary-500/30">
                      <Users className="w-4 h-4 text-primary-500" />
                    </div>
                    <span className="text-xs font-mono font-bold text-primary-800 uppercase tracking-widest">{project.team}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {role === 'judge' && (() => {
                      const assignment = assignments.find(a => a.project_id === project.id);
                      if (!assignment) return null;
                      return assignment.is_submitted ? (
                        <span className="text-green-600 text-xs font-bold px-3 py-1 bg-green-50 border border-green-200 rounded">Scored: {assignment.score}</span>
                      ) : (
                        <button onClick={() => setScoringAssignment(assignment)} className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded transition-colors shadow-md">Score Project</button>
                      );
                    })()}
                    <a href="#" className="text-xs font-mono font-bold text-secondary-500 hover:text-secondary-400 transition-colors flex items-center gap-1 group/link uppercase tracking-widest">
                      Access <ExternalLink className="w-3 h-3 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {scoringAssignment && (
          <ScoringModal 
            assignment={scoringAssignment} 
            token={localStorage.getItem('access_token')}
            onClose={() => setScoringAssignment(null)}
            onSuccess={(assignmentId, finalScore) => {
              setAssignments(assignments.map(a => a.assignment_id === assignmentId ? { ...a, is_submitted: true, score: finalScore } : a));
              setScoringAssignment(null);
            }}
          />
        )}
        
        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass-panel neon-border"
          >
            <Search className="w-12 h-12 text-primary-500/50 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-primary-600 mb-2 uppercase tracking-widest">NO_RECORDS_FOUND</h3>
            <p className="text-primary-500/50 font-mono text-sm">&gt; Modify query parameters.</p>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
