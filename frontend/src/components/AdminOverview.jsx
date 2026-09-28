import { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';

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
    
    // Generate dynamic dummy CSV based on state
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

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md mt-8 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-heading font-bold mb-6 text-white">System Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-darker p-6 rounded-2xl border border-white/5 shadow-lg shadow-black/20">
          <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Total Projects</p>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-5xl font-light text-white">{projects.length}</p>
            <span className="text-sm text-green-400 bg-green-400/10 px-2 py-1 rounded-md">+1 today</span>
          </div>
        </div>
        
        <div className="bg-bg-darker p-6 rounded-2xl border border-white/5 shadow-lg shadow-black/20">
          <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Registered Participants</p>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-5xl font-light text-white">{users.filter(u => u.role === 'participant').length}</p>
            <span className="text-sm text-green-400 bg-green-400/10 px-2 py-1 rounded-md">+2 today</span>
          </div>
        </div>
        
        <div className="bg-bg-darker p-6 rounded-2xl border border-white/5 shadow-lg shadow-black/20">
          <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">System Health</p>
          <div className="mt-4 flex flex-col gap-1">
            <p className="text-2xl font-medium text-green-400 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" /> All Systems Nominal
            </p>
            <p className="text-sm text-zinc-500">Local Docker nodes active</p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/10">
        <h3 className="text-lg font-medium text-white mb-4">Data Actions</h3>
        <div className="flex gap-4">
        <button 
          onClick={handleExportCSV}
          disabled={isExporting}
          className="px-6 py-3 bg-white text-zinc-900 hover:bg-zinc-200 border border-transparent rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-70"
        >
          <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} /> 
          {isExporting ? 'Exporting...' : 'Export All Data (CSV)'}
        </button>

        <button 
          onClick={handleRunAlgorithm}
          disabled={isRunning}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white border border-transparent rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-500/20"
        >
          <CheckCircle2 className={`w-4 h-4 ${isRunning ? 'animate-pulse' : ''}`} /> 
          {isRunning ? 'Running Algorithm...' : 'Run Judging Algorithm'}
        </button>
        </div>
      </div>
    </div>
  );
}
