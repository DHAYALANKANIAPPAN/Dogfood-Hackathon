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
    <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-4xl font-heading font-light mb-12 text-slate-900 flex items-center gap-4">
        <Activity className="w-10 h-10 text-primary-600" /> 
        System Analytics
      </h2>
      
      {/* Top Stat Text (No Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 border-t border-b border-slate-200 py-12">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Total Projects</p>
          <p className="text-7xl font-heading font-light text-slate-900 mt-4">{projects.length}</p>
        </div>
        
        <div className="flex flex-col border-l border-slate-200 pl-12">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Total Users</p>
          <p className="text-7xl font-heading font-light text-slate-900 mt-4">{users.length}</p>
        </div>
        
        <div className="flex flex-col border-l border-slate-200 pl-12">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">System Status</p>
          <div className="mt-4">
            <p className="text-5xl font-light text-green-500 flex items-center gap-3">
              <CheckCircle2 className="w-10 h-10" /> Online
            </p>
            <p className="text-sm font-medium text-slate-400 mt-4">All services operational</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts (No Containers) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
        
        {/* User Distribution Pie Chart */}
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">User Roles Distribution</h3>
          <div className="h-[300px]">
            {roleData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.1)', color: '#000', borderRadius: '0px' }}
                    itemStyle={{ color: '#000' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">No user data</div>
            )}
          </div>
          {/* Legend */}
          <div className="flex justify-start gap-8 mt-6">
            {roleData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-3">
                <div className="w-2 h-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-slate-600 font-medium uppercase tracking-wider">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Status Bar Chart */}
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Project Status</h3>
          <div className="h-[300px]">
            {projects.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectStatusData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} vertical={false} />
                  <XAxis dataKey="name" stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                  <YAxis stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 12 }} allowDecimals={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.1)', color: '#000', borderRadius: '0px' }}
                  />
                  <Bar dataKey="count" radius={[0, 0, 0, 0]} maxBarSize={60}>
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? COLORS[0] : COLORS[1]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">No project data</div>
            )}
          </div>
        </div>

      </div>

      {/* Admin Actions */}
      <div className="pt-12 border-t border-slate-200">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Execution Commands</h3>
        <div className="flex flex-wrap gap-6">
          <button 
            onClick={handleExportCSV}
            disabled={isExporting}
            className="px-8 py-4 bg-transparent hover:bg-slate-100 text-slate-900 border-2 border-slate-900 text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-3 disabled:opacity-70"
          >
            <Download className={`w-5 h-5 ${isExporting ? 'animate-bounce' : ''}`} /> 
            {isExporting ? 'Exporting...' : 'Export Data (CSV)'}
          </button>

          <button 
            onClick={handleRunAlgorithm}
            disabled={isRunning}
            className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white border-2 border-primary-600 text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-3 disabled:opacity-70"
          >
            <CheckCircle2 className={`w-5 h-5 ${isRunning ? 'animate-pulse' : ''}`} /> 
            {isRunning ? 'Running...' : 'Run Judging Algorithm'}
          </button>
        </div>
      </div>
    </div>
  );
}
