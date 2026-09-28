import { useState } from 'react';
import { UserCog, Trash2, Search } from 'lucide-react';

export default function AdminUsers({ users = [], setUsers }) {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (id, newRole) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ role: newRole })
      });
      if(res.ok) setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
      else alert('Failed to update role');
    } catch(e) {
      alert('Error updating role');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to remove this user?')) {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`http://localhost:8000/api/users/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) setUsers(users.filter(u => u.id !== id));
        else alert('Failed to delete user');
      } catch(e) {
        alert('Error deleting user');
      }
    }
  };

  return (
    <div className="bg-slate-100 border border-slate-200 rounded-3xl p-8 backdrop-blur-md mt-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-heading font-bold flex items-center gap-3 text-slate-900">
          <UserCog className="w-6 h-6 text-primary-600" /> User Management
        </h2>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-500" />
          </div>
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-bg-darker border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary-500/50 outline-none w-full md:w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
              <th className="pb-4 font-medium">User</th>
              <th className="pb-4 font-medium">Email</th>
              <th className="pb-4 font-medium">Role</th>
              <th className="pb-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map(user => (
              <tr key={user.id} className="group hover:bg-slate-100 transition-colors">
                <td className="py-4 flex items-center gap-3">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-8 h-8 rounded-full bg-bg-darker" />
                  <span className="font-medium text-zinc-100">{user.name}</span>
                </td>
                <td className="py-4 text-slate-600 text-sm">{user.email}</td>
                <td className="py-4">
                  <select 
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="bg-bg-darker border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-primary-500"
                  >
                    <option value="participant">Participant</option>
                    <option value="judge">Judge</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="py-4 text-right">
                  <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-100 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-slate-500">No users found matching "{search}"</div>
        )}
      </div>
    </div>
  );
}
