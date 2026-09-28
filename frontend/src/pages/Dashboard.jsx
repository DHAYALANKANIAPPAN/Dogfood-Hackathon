import { useState, useEffect } from 'react';
import { LogOut, Calendar, MapPin, Code2, Users, Shield, Gavel, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminConfig from '../components/AdminConfig';

import AdminOverview from '../components/AdminOverview';
import AdminUsers from '../components/AdminUsers';
import TeamManager from '../components/TeamManager';
import TeamsList from '../components/TeamsList';
import ProjectSubmitter from '../components/ProjectSubmitter';
import ScoringModal from '../components/ScoringModal';

export default function Dashboard({ role, setRole }) {
  const navigate = useNavigate();
  const [adminTab, setAdminTab] = useState('overview');
  const [judgeTab, setJudgeTab] = useState('assignments');

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  
  const [scoringAssignment, setScoringAssignment] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    if (role === 'admin') {
      fetch('http://localhost:8000/api/data/users', { headers })
        .then(res => res.json())
        .then(data => setUsers(data || []))
        .catch(err => console.error(err));
      
      fetch('http://localhost:8000/api/data/projects', { headers })
        .then(res => res.json())
        .then(data => setProjects(data || []))
        .catch(err => console.error(err));
    }
    
    if (role === 'judge') {
      fetch('http://localhost:8000/api/data/assignments', { headers })
        .then(res => res.json())
        .then(data => setAssignments(data || []))
        .catch(err => console.error(err));
    }
  }, [role]);

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-bg-darker text-white font-sans overflow-x-hidden relative"
    >
      {/* Cyberpunk Grid & Scanlines */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
      <div className="absolute top-[-100%] left-0 w-full h-8 bg-primary-500/20 blur-xl animate-scanline pointer-events-none" />
      
      {/* Navigation */}
      <nav className="border-b border-primary-500/20 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-sm bg-primary-500/20 border border-primary-500 flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.2)] group-hover:bg-primary-500 transition-colors">
              <Code2 className="w-5 h-5 text-primary-500 group-hover:text-black transition-colors" />
            </div>
            <span className="text-xl neon-text tracking-widest uppercase">Dogfood_OS</span>
          </Link>
          
          <div className="flex items-center gap-6">
            {(role === 'admin' || role === 'judge') && (
              <Link to="/gallery" className="text-zinc-400 hover:text-primary-400 transition-colors flex items-center gap-2 text-sm font-mono uppercase tracking-widest">
                <ImageIcon className="w-4 h-4" /> Gallery
              </Link>
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-black/50 rounded-sm border border-primary-500/30">
              {role === 'admin' && <Shield className="w-4 h-4 text-secondary-500" />}
              {role === 'judge' && <Gavel className="w-4 h-4 text-primary-500" />}
              {role === 'participant' && <Users className="w-4 h-4 text-primary-400" />}
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary-200">{role}</span>
            </div>
            <button onClick={handleLogout} className="text-zinc-500 hover:text-secondary-500 transition-colors flex items-center gap-2 text-sm font-mono uppercase tracking-widest">
              <LogOut className="w-4 h-4" /> Disconnect
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Header / Event Details */}
        <motion.section 
          initial={{ y: -20, opacity: 0, rotateX: 10 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
          className="mb-12 glass-panel neon-border p-8 md:p-12 relative overflow-visible"
          style={{ perspective: 1000 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-secondary-500/10 text-secondary-500 text-xs font-mono font-bold uppercase tracking-widest border border-secondary-500/50 mb-6">
              <div className="w-2 h-2 rounded-none bg-secondary-500 animate-pulse" /> SYSTEM_ONLINE
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 neon-text uppercase tracking-tight">Mainframe Interface</h1>
            <p className="text-lg text-primary-200/60 font-mono mb-8 leading-relaxed max-w-2xl">
              &gt; SECURE CONNECTION ESTABLISHED.<br/>
              &gt; OFFLINE-FIRST PROTOCOL ENGAGED.<br/>
              &gt; AWAITING COMMAND EXECUTION...
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 text-primary-300 bg-black/40 px-4 py-3 border border-primary-500/30">
                <Calendar className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-[10px] text-primary-500/50 font-mono font-bold uppercase tracking-widest">Time Remaining</p>
                  <p className="font-mono font-bold tracking-wider">72:00:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-primary-300 bg-black/40 px-4 py-3 border border-primary-500/30">
                <MapPin className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-[10px] text-primary-500/50 font-mono font-bold uppercase tracking-widest">Network Node</p>
                  <p className="font-mono font-bold tracking-wider">localhost (eno1)</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Role-Based Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 gap-8"
          >
            {role === 'admin' && (
              <div>
                <div className="flex gap-2 mb-8 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md w-fit">
                  <button 
                    onClick={() => setAdminTab('overview')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${adminTab === 'overview' ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                  >
                    System Overview
                  </button>
                  <button 
                    onClick={() => setAdminTab('config')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${adminTab === 'config' ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                  >
                    Event Config
                  </button>
                  <button 
                    onClick={() => setAdminTab('users')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${adminTab === 'users' ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                  >
                    Manage Users
                  </button>
                  <button 
                    onClick={() => setAdminTab('teams')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${adminTab === 'teams' ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                  >
                    Manage Teams
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={adminTab}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {adminTab === 'overview' && <AdminOverview users={users} projects={projects} />}
                    {adminTab === 'config' && <AdminConfig />}
                    {adminTab === 'users' && <AdminUsers users={users} setUsers={setUsers} />}
                    {adminTab === 'teams' && <TeamsList role={role} token={localStorage.getItem('access_token')} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {role === 'judge' && (
              <div>
                <div className="flex gap-2 mb-8 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md w-fit">
                  <button 
                    onClick={() => setJudgeTab('assignments')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${judgeTab === 'assignments' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                  >
                    Assignments
                  </button>
                  <button 
                    onClick={() => setJudgeTab('teams')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${judgeTab === 'teams' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                  >
                    Teams & Participants
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={judgeTab}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {judgeTab === 'assignments' && (
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                        <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-blue-100">
                          <Gavel className="w-6 h-6 text-blue-400" /> Judging Panel
                        </h2>
                        <p className="text-zinc-400 mb-8">Projects assigned to you for evaluation. Validate their work by checking their local GitHub profiles.</p>
                        
                        <div className="space-y-4">
                          {assignments.length === 0 ? (
                            <p className="text-zinc-500 italic">No assignments yet. Wait for admin to run algorithms.</p>
                          ) : assignments.map(a => (
                            <motion.div whileHover={{ scale: 1.01 }} key={a.assignment_id} className="bg-bg-darker p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-500/30 transition-colors group shadow-lg">
                              <div>
                                <h3 className="text-lg font-medium text-white group-hover:text-blue-300 transition-colors">{a.name}</h3>
                                <p className="text-sm text-zinc-500 mt-1">Submitted by {a.team}</p>
                              </div>
                              <div className="flex gap-3 items-center">
                                {a.is_submitted ? (
                                  <span className="text-green-400 text-sm font-bold bg-green-400/10 px-4 py-2 rounded-xl border border-green-400/20">Scored: {a.score}</span>
                                ) : (
                                  <>
                                    <a href={a.repo_url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors">View Repo</a>
                                    <button onClick={() => setScoringAssignment(a)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/20 transition-colors">Score Project</button>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
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
                      </div>
                    )}

                    {judgeTab === 'teams' && (
                      <TeamsList role={role} token={localStorage.getItem('access_token')} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {role === 'participant' && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-primary-100">
                  <Users className="w-6 h-6 text-primary-400" /> Participant Hub
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <TeamManager token={localStorage.getItem('access_token')} />
                  <ProjectSubmitter token={localStorage.getItem('access_token')} />
                </div>
                
                <div className="p-4 bg-primary-900/30 border border-primary-500/20 rounded-2xl">
                  <p className="text-sm text-primary-200">
                    <strong className="text-primary-400">Notice:</strong> Submissions close in 48 hours. Ensure your 5-minute demo video is uploaded.
                  </p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
