import { useState } from 'react';
import { X, CheckCircle, Star } from 'lucide-react';

export default function ScoringModal({ assignment, token, onClose, onSuccess }) {
  const [scores, setScores] = useState({ design: 5, technical: 5, pitch: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8000/api/judging/submit-rubric/${assignment.assignment_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(scores)
      });
      const data = await res.json();
      if(res.ok) {
        onSuccess(assignment.assignment_id, data.base_score);
      } else {
        alert(`Error: ${data.detail}`);
      }
    } catch(err) {
      alert("Failed to submit score.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" /> Score Project
          </h3>
          <button onClick={onClose} className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 bg-white">
          <div>
            <h4 className="text-lg font-bold text-slate-900">{assignment.name}</h4>
            <p className="text-sm text-slate-600 mt-1">Submitted by {assignment.team}</p>
          </div>

          <div className="space-y-4">
            {['design', 'technical', 'pitch'].map(criteria => (
              <div key={criteria}>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700 capitalize">{criteria}</label>
                  <span className="text-sm font-bold text-primary-600">{scores[criteria]} / 10</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="10" step="1"
                  value={scores[criteria]}
                  onChange={e => setScores({...scores, [criteria]: parseInt(e.target.value)})}
                  className="w-full accent-primary-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <button 
            disabled={isSubmitting}
            onClick={handleSubmit} 
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex justify-center items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" /> {isSubmitting ? 'Submitting...' : 'Confirm Scores'}
          </button>
        </div>
      </div>
    </div>
  );
}
