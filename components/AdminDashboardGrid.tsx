import React from 'react';
import { LayoutDashboard, Users, CreditCard, Clock } from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
  message?: string;
}

export const AdminDashboardGrid: React.FC<Props> = ({ onNavigate, message }) => {
  return (
    <div className="p-6 space-y-8 h-full flex flex-col justify-start">
      
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-bold text-primary">שלום, יוסף</h2>
            <p className="text-slate-500 text-sm">מה ברצונך לבצע היום?</p>
         </div>
         <div className="text-2xl">👋</div>
      </div>

      {/* Grid Content */}
      <section className="grid grid-cols-2 gap-5">
        {/* Tile 1: New Charge */}
        <button 
          onClick={() => onNavigate('add-charge')}
          className="group relative bg-surface p-5 rounded-2xl shadow-soft hover:shadow-lg transition-all duration-300 border border-slate-100 flex flex-col items-center justify-center space-y-3 aspect-[1.1]"
        >
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-400"></div>
          <div className="w-14 h-14 rounded-full bg-blue-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
             <span className="text-3xl font-light">+</span>
          </div>
          <span className="font-bold text-slate-700 group-hover:text-primary transition-colors">חיוב חדש</span>
        </button>

        {/* Tile 2: Manage Members */}
        <button 
          onClick={() => onNavigate('members')}
          className="group bg-surface p-5 rounded-2xl shadow-soft hover:shadow-lg transition-all duration-300 border border-slate-100 flex flex-col items-center justify-center space-y-3 aspect-[1.1]"
        >
          <div className="w-14 h-14 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-300">
             <span className="text-2xl">👥</span>
          </div>
          <span className="font-bold text-slate-700">ניהול חברים</span>
        </button>

        {/* Tile 3: Donations */}
        <button className="group bg-surface p-5 rounded-2xl shadow-soft hover:shadow-lg transition-all duration-300 border border-slate-100 flex flex-col items-center justify-center space-y-3 aspect-[1.1]">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors duration-300">
             <span className="text-2xl">💰</span>
          </div>
          <span className="font-bold text-slate-700">תרומות</span>
        </button>

        {/* Tile 4: Prayer Times */}
        <button 
          onClick={() => onNavigate('update-times')}
          className="group bg-surface p-5 rounded-2xl shadow-soft hover:shadow-lg transition-all duration-300 border border-slate-100 flex flex-col items-center justify-center space-y-3 aspect-[1.1]"
        >
           <div className="w-14 h-14 rounded-full bg-amber-50 text-gold flex items-center justify-center group-hover:bg-amber-100 transition-colors duration-300">
             <span className="text-2xl">⏰</span>
          </div>
          <span className="font-bold text-slate-700">זמני תפילה</span>
        </button>
      </section>

      {/* Notice Board Box */}
      <div className="bg-surface rounded-2xl shadow-soft border border-slate-100 overflow-hidden flex flex-col">
         <div className="bg-primary/5 p-3 flex justify-between items-center border-b border-primary/10">
            <h3 className="font-bold text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                לוח מודעות
            </h3>
         </div>
         <div className="p-6 min-h-[100px] flex items-center justify-center text-center">
             <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-slate-600">
                {message || "אין הודעות חדשות."}
             </p>
         </div>
      </div>
    </div>
  );
};