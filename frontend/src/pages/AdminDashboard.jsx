import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import API from '../services/api';
import { Calendar, Users, Check, X, Plus, Info, Globe, Filter, Search, MoreVertical, LayoutGrid, Clock, Edit2, Trash2, Send, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [companyLeaves, setCompanyLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showNotifForm, setShowNotifForm] = useState(false);
  
  const [companyFormData, setCompanyFormData] = useState({ title: '', date: '', id: null });
  const [assignDays, setAssignDays] = useState(10);
  const [notifData, setNotifData] = useState({ title: '', message: '', target: 'all' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leavesRes, companyLeavesRes] = await Promise.all([
        API.get('/admin/leaves'),
        API.get('/admin/company-leaves')
      ]);
      setLeaves(leavesRes.data);
      setCompanyLeaves(companyLeavesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(id);
    try {
      await API.put(`/admin/leaves/${id}`, { status });
      setMessage(`Request ${status} successfully!`);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleHolidaySubmit = async (e) => {
    e.preventDefault();
    try {
      if (companyFormData.id) {
        await API.put(`/admin/company-leaves/${companyFormData.id}`, companyFormData);
        setMessage('Holiday updated!');
      } else {
        await API.post('/admin/company-leaves', companyFormData);
        setMessage('Holiday added!');
      }
      setCompanyFormData({ title: '', date: '', id: null });
      setShowCompanyForm(false);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to process holiday');
    }
  };

  const deleteHoliday = async (id) => {
    if (!window.confirm('Delete this holiday?')) return;
    try {
      await API.delete(`/admin/company-leaves/${id}`);
      fetchData();
      setMessage('Holiday deleted');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleSendNotif = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/notifications', notifData);
      setNotifData({ title: '', message: '', target: 'all' });
      setShowNotifForm(false);
      setMessage('Notification sent!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to send notification');
    }
  };

  const handleAssignAll = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Set ${assignDays} leave days for ALL?`)) return;
    try {
      await API.post('/admin/assign-all', { days: assignDays });
      setMessage(`Assigned ${assignDays} leaves to everyone!`);
      setShowAssignForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to assign');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {message && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl font-bold flex items-center space-x-3 animate-in slide-in-from-top-10">
            <Check size={20} className="text-green-400" />
            <span>{message}</span>
          </div>
        )}

        {/* Admin Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 animate-in">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Console</h2>
            <p className="text-slate-500 font-medium mt-1">Manage employee leave requests and company holidays.</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button 
              onClick={() => setShowNotifForm(!showNotifForm)}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white px-5 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Send size={18} />
              <span>Send Alert</span>
            </button>
            <button 
              onClick={() => setShowAssignForm(!showAssignForm)}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-indigo-50 text-indigo-700 px-5 py-3 rounded-2xl font-bold border border-indigo-100 hover:bg-indigo-100 transition-all shadow-sm"
            >
              <Users size={18} />
              <span>Bulk Assign</span>
            </button>
            <button 
              onClick={() => {
                setCompanyFormData({ title: '', date: '', id: null });
                setShowCompanyForm(!showCompanyForm);
              }}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 premium-gradient text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-primary-200 transition-all active:scale-95"
            >
              <Plus size={18} />
              <span>Add Holiday</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8 animate-in" style={{ animationDelay: '0.2s' }}>
            {/* Main List: Leave Requests */}
            <div className="glass-card bg-white rounded-[2rem] shadow-2xl border border-white overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center bg-white/50 gap-4">
                 <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Manage Requests</h3>
                 <div className="relative w-full md:w-64">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search employees..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
                    />
                 </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead>
                     <tr className="bg-slate-50/50 text-left">
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Employee</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Type & Days</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Period</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                       <th className="px-8 py-5 text-right"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {loading ? (
                        <tr><td colSpan="5" className="p-20 text-center text-slate-300 italic">Syncing with server...</td></tr>
                     ) : leaves.length === 0 ? (
                        <tr><td colSpan="5" className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No pending requests.</td></tr>
                     ) : (
                       leaves.map((leave) => (
                         <tr key={leave._id} className="hover:bg-primary-50/30 transition-all group">
                           <td className="px-8 py-6">
                             <div className="flex items-center space-x-4">
                               <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm border border-slate-200 uppercase">
                                 {leave.userId?.name?.charAt(0)}
                               </div>
                               <div>
                                 <p className="font-extrabold text-slate-900 leading-tight uppercase tracking-tight">{leave.userId?.name}</p>
                                 <p className="text-[11px] text-slate-400 font-bold">{leave.userId?.email}</p>
                               </div>
                             </div>
                           </td>
                           <td className="px-8 py-6">
                             <div className="flex flex-col">
                               <span className="text-sm font-bold text-slate-700">{leave.type}</span>
                               <span className="text-xs text-primary-600 font-black">{leave.days} DAYS</span>
                             </div>
                           </td>
                           <td className="px-8 py-6">
                             <p className="text-sm font-bold text-slate-700">
                               {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                             </p>
                           </td>
                           <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                                leave.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' : 
                                leave.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                                'bg-amber-50 text-amber-700 border-amber-100'
                              }`}>
                                {leave.status}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-right">
                               <div className="flex justify-end space-x-2">
                                 <button 
                                   onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                                   disabled={actionLoading === leave._id}
                                   className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm border border-green-100 disabled:opacity-50"
                                   title="Approve"
                                 >
                                   <Check size={18} />
                                 </button>
                                 <button 
                                   onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                                   disabled={actionLoading === leave._id}
                                   className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100 disabled:opacity-50"
                                   title="Reject"
                                 >
                                   <X size={18} />
                                 </button>
                               </div>
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>

          {/* Right Column: Calendar & Forms */}
          <div className="lg:col-span-4 space-y-8 animate-in" style={{ animationDelay: '0.3s' }}>
            
            {/* Holiday Calendar Card */}
            <div className="glass-card bg-white rounded-[2rem] p-8 shadow-xl border border-white">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Holiday Calendar</h3>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Calendar size={20} />
                </div>
              </div>

              {showAssignForm && (
                <form onSubmit={handleAssignAll} className="mb-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4 animate-in">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-indigo-400 uppercase tracking-widest">Assign Balance (Days)</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={assignDays}
                      onChange={(e) => setAssignDays(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all">
                    Update Everyone
                  </button>
                  <button type="button" onClick={() => setShowAssignForm(false)} className="w-full text-indigo-400 text-xs font-bold py-2 hover:text-indigo-600 transition-colors">Cancel</button>
                </form>
              )}

              {showNotifForm && (
                <form onSubmit={handleSendNotif} className="mb-8 p-6 bg-primary-50/50 rounded-2xl border border-primary-100 space-y-4 animate-in">
                   <div className="flex items-center space-x-2 mb-2 text-primary-600">
                     <AlertCircle size={16} />
                     <span className="text-xs font-black uppercase tracking-widest">Send Manual Alert</span>
                   </div>
                   <input 
                      type="text" 
                      placeholder="Title"
                      required
                      value={notifData.title}
                      onChange={(e) => setNotifData({...notifData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-primary-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
                    />
                    <textarea 
                      placeholder="Your message here..."
                      required
                      rows="3"
                      value={notifData.message}
                      onChange={(e) => setNotifData({...notifData, message: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-primary-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium resize-none"
                    />
                  <button type="submit" className="w-full bg-primary-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-200 active:scale-[0.98] transition-all">
                    Send Notification
                  </button>
                  <button type="button" onClick={() => setShowNotifForm(false)} className="w-full text-primary-400 text-xs font-bold py-2 hover:text-primary-600 transition-colors">Cancel</button>
                </form>
              )}

              {showCompanyForm && (
                <form onSubmit={handleHolidaySubmit} className="mb-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4 animate-in">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Holiday Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Eid Holidays"
                      required
                      value={companyFormData.title}
                      onChange={(e) => setCompanyFormData({...companyFormData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Date</label>
                    <input 
                      type="date" 
                      required
                      value={companyFormData.date}
                      onChange={(e) => setCompanyFormData({...companyFormData, date: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
                    />
                  </div>
                  <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl text-sm font-bold shadow-xl active:scale-[0.98] transition-all">
                    {companyFormData.id ? 'Update Holiday' : 'Add Holiday'}
                  </button>
                  <button type="button" onClick={() => setShowCompanyForm(false)} className="w-full text-slate-400 text-xs font-bold py-2 hover:text-slate-600 transition-colors">Cancel</button>
                </form>
              )}

              <div className="space-y-4">
                {companyLeaves.map((leave) => (
                  <div key={leave._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group flex justify-between items-center">
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">{leave.title}</p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{format(new Date(leave.date), 'MMMM dd, yyyy')}</p>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setCompanyFormData({ title: leave.title, date: format(new Date(leave.date), 'yyyy-MM-dd'), id: leave._id });
                          setShowCompanyForm(true);
                        }}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => deleteHoliday(leave._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
