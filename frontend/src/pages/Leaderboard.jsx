import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Activity, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/judging/leaderboard');
        const data = await res.json();
        setLeaderboard(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-400 inline-block mr-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />;
      case 1: return <Medal className="w-5 h-5 text-zinc-300 inline-block mr-2 drop-shadow-[0_0_10px_rgba(212,212,216,0.8)]" />;
      case 2: return <Award className="w-5 h-5 text-amber-600 inline-block mr-2 drop-shadow-[0_0_10px_rgba(217,119,6,0.8)]" />;
      default: return <span className="font-bold text-zinc-500 mr-2">{index + 1}</span>;
    }
  };

  // Only chart top 10
  const chartData = leaderboard.slice(0, 10).map((p, i) => ({
    name: p.team_name,
    score: parseFloat(p.score.toFixed(1)),
    rank: i + 1
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-semibold text-white mb-4 tracking-wide">Live Scoreboard</h1>
        <p className="text-zinc-400 font-medium tracking-wide text-sm flex items-center justify-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Live Sync Active
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Top 10 Chart (CTFd Style) */}
          {leaderboard.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-3xl h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#a1a1aa" 
                    tick={{ fill: '#a1a1aa', fontSize: 12 }} 
                    angle={-45} 
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis 
                    stroke="#a1a1aa" 
                    tick={{ fill: '#a1a1aa' }}
                    domain={[0, 10]}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(20,20,20,0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#818cf8' : index === 1 ? '#a5b4fc' : index === 2 ? '#c7d2fe' : '#e0e7ff'} opacity={index < 3 ? 1 : 0.6} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Table (CTFd Style) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-3xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                    <th className="p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-24 text-center">Place</th>
                    <th className="p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Team</th>
                    <th className="p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Project</th>
                    <th className="p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((project, index) => (
                    <tr 
                      key={project.id} 
                      className={`border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors ${index < 3 ? 'bg-primary-500/[0.02]' : ''}`}
                    >
                      <td className="p-5 text-center font-semibold text-white">
                        {getRankIcon(index)}
                      </td>
                      <td className="p-5">
                        <span className={`font-semibold ${index === 0 ? 'text-primary-400' : 'text-white'}`}>
                          {project.team_name}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className="text-zinc-400 text-sm">{project.title}</span>
                      </td>
                      <td className="p-5 text-right">
                        <span className="text-xl font-heading font-semibold text-white">
                          {project.score.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-zinc-500">
                        No projects ranked yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
