import { useState, useEffect } from 'react';
import { LogOut, Calendar, MapPin, Code2, Dog, Users, Shield, Gavel, CheckCircle2, Image as ImageIcon, Trophy } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminConfig from '../components/AdminConfig';

import AdminOverview from '../components/AdminOverview';
import AdminUsers from '../components/AdminUsers';
import AdminProblems from '../components/AdminProblems';
import TeamManager from '../components/TeamManager';
import TeamsList from '../components/TeamsList';
import ProjectSubmitter from '../components/ProjectSubmitter';
import ScoringModal from '../components/ScoringModal';
import Helpdesk from '../components/Helpdesk';
import Announcements from '../components/Announcements';

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

  return (
    <div className="relative">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Header / Event Details */}
        <motion.section 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 glass-panel p-8 md:p-12 relative rounded-3xl"
        >
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 text-primary-600 text-xs font-medium rounded-full border border-primary-500/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" /> Live Event Active
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-4 text-slate-900">Event Dashboard</h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl">
              Welcome to the central hub for the Dogfood 2026 Hackathon. Manage your projects, teams, and judging assignments here.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-5 py-4 border border-slate-200">
                <Calendar className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Time Remaining</p>
                  <p className="font-semibold text-slate-800">72 Hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-5 py-4 border border-slate-200">
                <MapPin className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Location</p>
                  <p className="font-semibold text-slate-800">Silicon Valley Campus</p>
                </div>
              </div>
            <div className="flex flex-wrap gap-4 mt-6">
              <button 
                onClick={() => document.getElementById('announcements-section').scrollIntoView({ behavior: 'smooth' })}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all shadow-sm"
              >
                View Live Timeline
              </button>
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
                <div className="flex gap-2 mb-8 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 w-fit">
                  <button 
                    onClick={() => setAdminTab('overview')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${adminTab === 'overview' ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
                  >
                    System Overview
                  </button>
                  <button 
                    onClick={() => setAdminTab('config')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${adminTab === 'config' ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
                  >
                    Event Config
                  </button>
                  <button 
                    onClick={() => setAdminTab('users')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${adminTab === 'users' ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
                  >
                    Manage Users
                  </button>
                  <button 
                    onClick={() => setAdminTab('problems')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${adminTab === 'problems' ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
                  >
                    Problem Statements
                  </button>
                  <button 
                    onClick={() => setAdminTab('teams')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${adminTab === 'teams' ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
                  >
                    Manage Teams
                  </button>
                  <button 
                    onClick={() => setAdminTab('helpdesk')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${adminTab === 'helpdesk' ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
                  >
                    Helpdesk
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
                    {adminTab === 'problems' && <AdminProblems token={localStorage.getItem('access_token')} />}
                    {adminTab === 'teams' && <TeamsList role={role} token={localStorage.getItem('access_token')} />}
                    {adminTab === 'helpdesk' && <Helpdesk role={role} />}
                  </motion.div>
                </AnimatePresence>
                
                <div id="announcements-section">
                  <Announcements role={role} />
                </div>
              </div>
            )}

            {role === 'judge' && (
              <div>
                <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 backdrop-blur-md w-fit">
                  <button 
                    onClick={() => setJudgeTab('assignments')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${judgeTab === 'assignments' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
                  >
                    Assignments
                  </button>
                  <button 
                    onClick={() => setJudgeTab('teams')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${judgeTab === 'teams' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
                  >
                    Teams & Participants
                  </button>
                  <button 
                    onClick={() => setJudgeTab('helpdesk')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${judgeTab === 'helpdesk' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
                  >
                    Helpdesk
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
                      <div className="bg-slate-100 border border-slate-200 rounded-3xl p-8 backdrop-blur-md">
                        <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-blue-100">
                          <Gavel className="w-6 h-6 text-blue-400" /> Judging Panel
                        </h2>
                        <p className="text-slate-600 mb-8">Projects assigned to you for evaluation. Validate their work by checking their local GitHub profiles.</p>
                        
                        <div className="space-y-4">
                          {assignments.length === 0 ? (
                            <p className="text-slate-500 italic">No assignments yet. Wait for admin to run algorithms.</p>
                          ) : assignments.map(a => (
                            <motion.div whileHover={{ scale: 1.01 }} key={a.assignment_id} className="bg-bg-darker p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-500/30 transition-colors group shadow-lg">
                              <div>
                                <h3 className="text-lg font-medium text-slate-900 group-hover:text-blue-300 transition-colors">{a.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">Submitted by {a.team}</p>
                              </div>
                              <div className="flex gap-3 items-center">
                                {a.is_submitted ? (
                                  <span className="text-green-400 text-sm font-bold bg-green-400/10 px-4 py-2 rounded-xl border border-green-400/20">Scored: {a.score}</span>
                                ) : (
                                  <>
                                    <a href={a.repo_url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-sm font-medium transition-colors">View Repo</a>
                                    <button onClick={() => setScoringAssignment(a)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-slate-900 rounded-xl text-sm font-medium shadow-lg shadow-blue-500/20 transition-colors">Score Project</button>
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
                    {judgeTab === 'helpdesk' && (
                      <Helpdesk role={role} />
                    )}
                  </motion.div>
                </AnimatePresence>
                
                <div id="announcements-section">
                  <Announcements role={role} />
                </div>
              </div>
            )}

            {role === 'participant' && (
              <div className="bg-slate-100 border border-slate-200 rounded-3xl p-8 backdrop-blur-md">
                <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary-600" /> 
                  <span className="text-primary-600">Participant</span> <span className="text-red-500">Hub</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <TeamManager token={localStorage.getItem('access_token')} />
                  <ProjectSubmitter token={localStorage.getItem('access_token')} />
                </div>
                
                <div className="p-4 bg-primary-50 border border-primary-500/20 rounded-2xl mb-8">
                  <p className="text-sm text-primary-800">
                    <strong className="text-primary-600">Notice:</strong> Submissions close in 48 hours. Ensure your 5-minute demo video is uploaded.
                  </p>
                </div>

                <Helpdesk role={role} />
                
                <div id="announcements-section">
                  <Announcements role={role} />
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
