import { useState } from 'react';
import { Download, CheckCircle2, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function AdminOverview({ users = [], projects = [] }) {
  const [isExporting, setIsExporting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunAlgorithm = async () => {
    setIsRunning(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:8000/api/judging/run-assignments?reviews_per_project=2', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) alert(`Success! ${data.assignments_created || 'Algorithm run complete.'}`);
      else alert(`Error: ${data.detail}`);
    } catch (error) {
      alert('Failed to run algorithm.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = "id,name,role,status\n";
      const rows = users.map(u => `${u.id},${u.name},${u.role},Active`).join('\n');
      const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "dogfood_hackathon_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
    }, 1000);
  };

  // Analytics Data Preparation
  const roleData = [
    { name: 'Participants', value: users.filter(u => String(u.role).toLowerCase() === 'participant').length },
    { name: 'Judges', value: users.filter(u => String(u.role).toLowerCase() === 'judge').length },
    { name: 'Admins', value: users.filter(u => String(u.role).toLowerCase() === 'admin').length },
  ].filter(d => d.value > 0);

  const projectStatusData = [
    { name: 'Submitted', count: projects.filter(p => !p.is_draft).length },
    { name: 'Drafts', count: projects.filter(p => p.is_draft).length }
  ];

  const COLORS = ['#00f0ff', '#ff003c', '#00ff66'];

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 mt-8 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-heading font-semibold mb-6 text-white flex items-center gap-3">
        <Activity className="w-6 h-6 text-primary-400" /> 
        System Analytics
      </h2>
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/[0.05]">
          <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Total Projects</p>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-5xl font-heading font-semibold text-white">{projects.length}</p>
          </div>
        </div>
        
        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/[0.05]">
          <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Total Users</p>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-5xl font-heading font-semibold text-white">{users.length}</p>
          </div>
        </div>
        
        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/[0.05]">
          <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">System Status</p>
          <div className="mt-4 flex flex-col gap-1">
            <p className="text-2xl font-semibold text-green-400 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" /> Online
            </p>
            <p className="text-xs text-zinc-500 mt-2">All services operational</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
        {/* User Distribution Pie Chart */}
        <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/[0.05]">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6 text-center">User Roles Distribution</h3>
          <div className="h-[250px]">
            {roleData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(20,20,20,0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">No user data</div>
            )}
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            {roleData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-zinc-400 font-medium">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Status Bar Chart */}
        <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/[0.05]">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6 text-center">Project Status</h3>
          <div className="h-[250px]">
            {projects.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectStatusData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} vertical={false} />
                  <XAxis dataKey="name" stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                  <YAxis stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 12 }} allowDecimals={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(20,20,20,0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? COLORS[0] : COLORS[1]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">No project data</div>
            )}
          </div>
        </div>

      </div>

      {/* Admin Actions */}
      <div className="pt-8 border-t border-white/10">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">Execution Commands</h3>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleExportCSV}
            disabled={isExporting}
            className="px-6 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-70"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} /> 
            {isExporting ? 'Exporting...' : 'Export Data (CSV)'}
          </button>

          <button 
            onClick={handleRunAlgorithm}
            disabled={isRunning}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-70"
          >
            <CheckCircle2 className={`w-4 h-4 ${isRunning ? 'animate-pulse' : ''}`} /> 
            {isRunning ? 'Running...' : 'Run Judging Algorithm'}
          </button>
        </div>
      </div>
    </div>
  );
}
