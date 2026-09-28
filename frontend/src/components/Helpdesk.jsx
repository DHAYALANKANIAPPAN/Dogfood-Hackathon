import { useState, useEffect } from 'react';
import { HelpCircle, MapPin, MessageSquare, Clock, CheckCircle2, ChevronRight, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Helpdesk({ role }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // New request form state
  const [issue, setIssue] = useState("");
  const [location, setLocation] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/help-requests', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/help-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ issue_description: issue, location })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to submit request");
      }
      
      setIssue("");
      setLocation("");
      setShowModal(false);
      fetchRequests();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/api/help-requests/${id}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        fetchRequests();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 mt-8 animate-in fade-in slide-in-from-bottom-4 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-white flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-primary-400" />
            Mentor Helpdesk
          </h2>
          <p className="text-zinc-400 mt-2">
            {role === 'participant' 
              ? "Request a mentor to come to your table for technical help."
              : "Live queue of teams requesting mentorship or assistance."}
          </p>
        </div>
        
        {role === 'participant' && (
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Request Mentor
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-8 text-zinc-500">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-12 h-12 text-green-400/50 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Queue is clear!</h3>
          <p className="text-zinc-400 max-w-sm">There are no active help requests right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(req => (
            <div key={req.id} className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-6 relative group overflow-hidden">
              {req.status === 'OPEN' && <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />}
              {req.status === 'IN_PROGRESS' && <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />}
              {req.status === 'RESOLVED' && <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />}
              
              <div className="flex justify-between items-start mb-4 mt-1">
                <span className="text-sm font-medium text-white px-3 py-1 bg-white/[0.05] rounded-lg">
                  {req.team_name}
                </span>
                <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded ${
                  req.status === 'OPEN' ? 'bg-red-500/20 text-red-400' :
                  req.status === 'IN_PROGRESS' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {req.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="mb-6">
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">{req.issue_description}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <MapPin className="w-3 h-3" /> {req.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-2">
                  <Clock className="w-3 h-3" /> {new Date(req.created_at).toLocaleTimeString()}
                </div>
              </div>

              {(role === 'admin' || role === 'judge') && req.status !== 'RESOLVED' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.05]">
                  {req.status === 'OPEN' && (
                    <button 
                      onClick={() => updateStatus(req.id, 'IN_PROGRESS')}
                      className="flex-1 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-lg transition-colors"
                    >
                      Claim Ticket
                    </button>
                  )}
                  <button 
                    onClick={() => updateStatus(req.id, 'RESOLVED')}
                    className="flex-1 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-medium rounded-lg transition-colors"
                  >
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-heading font-semibold text-white mb-6">Request Mentor Assistance</h3>
              
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">What do you need help with?</label>
                  <textarea 
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-primary-500 h-32 resize-none transition-colors"
                    placeholder="E.g. We are stuck on CORS errors with our Python backend..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Where are you located?</label>
                  <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="E.g. Table 42 near the Red Bull fridge"
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 text-zinc-400 hover:text-white transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
