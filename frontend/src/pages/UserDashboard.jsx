import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, CheckCircle, XCircle, Plus, Send, Info, ChevronRight, PieChart } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const UserDashboard = () => {
  const { user, fetchUserProfile } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await API.get('/leaves/myhistory');
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage({ type: '', text: '' });

    const days = differenceInDays(new Date(formData.endDate), new Date(formData.startDate)) + 1;
    
    if (days <= 0) {
      setMessage({ type: 'error', text: 'End date must be after start date' });
      setFormLoading(false);
      return;
    }

    try {
      await API.post('/leaves', { ...formData, days });
      setMessage({ type: 'success', text: 'Leave request submitted successfully!' });
      setFormData({ type: 'Annual Leave', startDate: '', endDate: '', reason: '' });
      fetchHistory();
      fetchUserProfile();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to apply' });
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Approved: 'bg-green-50 text-green-700 border-green-100',
      Rejected: 'bg-red-50 text-red-700 border-red-100',
      Pending: 'bg-amber-50 text-amber-700 border-amber-100',
    };
    const icons = {
      Approved: <CheckCircle size={14} />,
      Rejected: <XCircle size={14} />,
      Pending: <Clock size={14} />,
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center w-fit space-x-1.5 ${styles[status]}`}>
        {icons[status]}
        <span className="uppercase tracking-wider">{status}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Header */}
        <div className="mb-10 animate-in">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Good morning, <span className="uppercase">{user?.name.split(' ')[0]}</span>!</h2>
          <p className="text-slate-500 font-medium mt-1">Here's an overview of your leave status and history.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Stats & Form */}
          <div className="lg:col-span-4 space-y-8 animate-in" style={{ animationDelay: '0.1s' }}>
            {/* Premium Balance Card */}
            <div className="premium-gradient rounded-3xl p-8 text-white shadow-2xl shadow-primary-200 relative overflow-hidden group">
               <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10">
                 <div className="flex justify-between items-center mb-6">
                   <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                     <PieChart size={24} />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Annual Balance</span>
                 </div>
                 <div className="flex items-baseline space-x-3">
                   <span className="text-7xl font-black tracking-tighter">{user?.leaveBalance}</span>
                   <span className="text-xl font-bold opacity-70 italic">Days left</span>
                 </div>
                 <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-sm font-medium">
                   <span className="opacity-70 text-xs">Fiscal Year 2026</span>
                   <button className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-xl transition-all backdrop-blur-sm text-xs font-bold">Details</button>
                 </div>
               </div>
            </div>

            {/* Application Form */}
            <div className="glass-card bg-white rounded-3xl p-8 shadow-xl border border-white">
               <div className="flex items-center space-x-3 mb-8">
                 <div className="p-2.5 bg-primary-50 rounded-xl text-primary-600">
                   <Plus size={20} />
                 </div>
                 <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Quick Application</h3>
               </div>

               <form onSubmit={handleApply} className="space-y-5">
                 <div className="space-y-1.5">
                   <label className="text-sm font-bold text-slate-700 ml-1">Leave Type</label>
                   <select 
                     value={formData.type}
                     onChange={(e) => setFormData({...formData, type: e.target.value})}
                     className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-900 font-medium appearance-none cursor-pointer"
                   >
                     <option value="Annual Leave">Annual Leave</option>
                     <option value="Sick Leave">Sick Leave</option>
                     <option value="Company Leave">Company Leave</option>
                   </select>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-sm font-bold text-slate-700 ml-1">From</label>
                     <input 
                       type="date"
                       required
                       value={formData.startDate}
                       onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                       className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-sm text-slate-900 font-medium"
                     />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-bold text-slate-700 ml-1">To</label>
                     <input 
                       type="date"
                       required
                       value={formData.endDate}
                       onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                       className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-sm text-slate-900 font-medium"
                     />
                   </div>
                 </div>

                 <div className="space-y-1.5">
                   <label className="text-sm font-bold text-slate-700 ml-1">Reason (Optional)</label>
                   <textarea 
                     rows="3"
                     value={formData.reason}
                     onChange={(e) => setFormData({...formData, reason: e.target.value})}
                     className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-900 font-medium resize-none placeholder:text-slate-300"
                     placeholder="Brief reason for your leave..."
                   />
                 </div>

                 {message.text && (
                   <div className={`p-4 rounded-2xl text-sm font-bold flex items-center space-x-2 animate-in ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                     <Info size={18} />
                     <span>{message.text}</span>
                   </div>
                 )}

                 <button 
                   type="submit"
                   disabled={formLoading}
                   className="w-full premium-gradient hover:brightness-110 text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary-200 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 group"
                 >
                   {formLoading ? (
                     <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                   ) : (
                     <>
                       <Send size={18} />
                       <span>Send Request</span>
                     </>
                   )}
                 </button>
               </form>
            </div>
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-8 animate-in" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card bg-white rounded-[2rem] shadow-xl border border-white overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/50">
                 <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Activity</h3>
                 <div className="flex space-x-2">
                    <button className="text-xs font-bold text-slate-400 hover:text-primary-600 bg-slate-50 hover:bg-primary-50 px-4 py-2 rounded-xl transition-all">Export</button>
                    <button className="text-xs font-bold text-slate-400 hover:text-primary-600 bg-slate-50 hover:bg-primary-50 px-4 py-2 rounded-xl transition-all">Filter</button>
                 </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead>
                     <tr className="bg-slate-50/50 text-left">
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Duration</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Days</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                       <th className="px-8 py-5"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {loading ? (
                        <tr><td colSpan="5" className="p-20 text-center text-slate-300">Loading your history...</td></tr>
                     ) : history.length === 0 ? (
                       <tr>
                         <td colSpan="5" className="px-8 py-20 text-center">
                           <div className="flex flex-col items-center">
                             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                               <Calendar size={40} />
                             </div>
                             <p className="text-slate-400 font-bold">No leave history found yet.</p>
                           </div>
                         </td>
                       </tr>
                     ) : (
                       history.map((leave) => (
                         <tr key={leave._id} className="hover:bg-primary-50/30 transition-all cursor-default group">
                           <td className="px-8 py-6">
                             <div className="flex items-center space-x-3">
                                <div className={`w-2 h-10 rounded-full ${leave.type === 'Annual Leave' ? 'bg-primary-500' : leave.type === 'Sick Leave' ? 'bg-amber-500' : 'bg-indigo-500'}`}></div>
                                <div>
                                  <p className="font-bold text-slate-900">{leave.type}</p>
                                  <p className="text-xs text-slate-400 font-medium">Applied on {format(new Date(leave.createdAt), 'MMM dd')}</p>
                                </div>
                             </div>
                           </td>
                           <td className="px-8 py-6">
                             <div className="text-sm font-bold text-slate-700">
                               {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                             </div>
                           </td>
                           <td className="px-8 py-6 text-sm font-black text-slate-900">
                             {leave.days} <span className="text-[10px] text-slate-400">DAYS</span>
                           </td>
                           <td className="px-8 py-6">
                             {getStatusBadge(leave.status)}
                           </td>
                           <td className="px-8 py-6 text-right">
                             <button className="text-slate-300 group-hover:text-primary-600 transition-colors">
                               <ChevronRight size={20} />
                             </button>
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
               
               <div className="p-6 bg-slate-50/50 text-center border-t border-slate-50">
                  <p className="text-xs font-bold text-slate-400">Showing last {history.length} records</p>
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
