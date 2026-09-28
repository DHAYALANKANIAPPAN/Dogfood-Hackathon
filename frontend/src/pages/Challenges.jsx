import { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';

export default function Challenges() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/data/public/problems')
      .then(res => res.json())
      .then(data => {
        setProblems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-zinc-500">Loading problem statements...</div>;
  }

  if (problems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-heading font-bold text-white mb-4">No Problem Statements Yet</h1>
        <p className="text-zinc-400">The admins have not released any problem statements.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      {problems.map((problem) => (
        <div key={problem.id} className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-4xl font-heading font-bold mb-6 text-white">
            {problem.title}
          </h1>
          
          <div className="flex items-center gap-3 mb-8">
            <span className="px-3 py-1 bg-primary-500/10 text-primary-400 text-xs font-semibold uppercase tracking-wider rounded-md border border-primary-500/20">
              Main Track
            </span>
            <span className="px-3 py-1 bg-white/5 text-zinc-400 text-xs font-semibold uppercase tracking-wider rounded-md border border-white/10">
              {new Date(problem.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="space-y-8 text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap">
            {problem.description}
          </div>
        </div>
      ))}
    </div>
  );
}
