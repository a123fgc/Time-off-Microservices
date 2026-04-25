import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, Bell, X, Check } from 'lucide-react';
import API from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const Header = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Fetch every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="glass-nav sticky top-0 z-50 px-6 py-4 flex justify-between items-center animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="premium-gradient p-2.5 rounded-2xl text-white shadow-lg shadow-primary-200 animate-bounce-soft">
          <Calendar size={24} />
        </div>
        <div>
           <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
             Timeoff<span className="text-primary-600">Sync</span>
           </h1>
           <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-1">Enterprise Edition</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-[9px] font-black text-white rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4">
              <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h4 className="font-extrabold text-slate-900 text-sm">Notifications</h4>
                <button onClick={() => setShowNotifications(false)}><X size={16} className="text-slate-400" /></button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-xs text-slate-400 font-bold">No notifications yet.</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif._id} 
                      className={`p-4 border-b border-slate-50 transition-colors flex space-x-3 ${notif.isRead ? 'opacity-60' : 'bg-primary-50/20'}`}
                    >
                      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notif.isRead ? 'bg-slate-200' : 'bg-primary-500 animate-pulse'}`}></div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-slate-900 mb-1">{notif.title}</p>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-2">{notif.message}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-slate-400">{formatDistanceToNow(new Date(notif.createdAt))} ago</span>
                          {!notif.isRead && (
                            <button 
                              onClick={() => markAsRead(notif._id)}
                              className="text-[9px] font-black text-primary-600 hover:underline uppercase"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-10 w-[1px] bg-slate-200 hidden md:block"></div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">{user?.name}</span>
            <span className="text-[10px] font-extrabold text-primary-600 uppercase tracking-wider bg-primary-50 px-2 py-0.5 rounded-md">{user?.role}</span>
          </div>
          
          <div className="h-11 w-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 border border-slate-200 overflow-hidden">
            <User size={22} />
          </div>

          <button 
            onClick={logout}
            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group"
            title="Sign Out"
          >
            <LogOut size={22} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
