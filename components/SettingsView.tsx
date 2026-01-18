import React from 'react';

export const SettingsView: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-paper-bg">
      <div className="flex-1 overflow-y-auto">
        {/* Profile Section */}
        <div className="p-8 bg-white border-b border-slate-100 flex items-center space-x-5 space-x-reverse shadow-sm">
           <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-900/20 ring-4 ring-blue-50">
             יו
           </div>
           <div>
             <h2 className="font-bold text-xl text-slate-800">יוסף כהן</h2>
             <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mt-1 bg-slate-100 px-2 py-0.5 rounded-md inline-block">גבאי ראשי</p>
           </div>
        </div>

        {/* Menu Items */}
        <div className="p-6 space-y-8">
           <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-400 mr-2">כללי</h3>
              <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
                  <button className="w-full p-4 flex justify-between items-center text-slate-800 hover:bg-slate-50 transition-colors border-b border-slate-50">
                     <span className="text-sm font-medium">פרופיל בית הכנסת</span>
                     <span className="text-slate-400 text-lg">›</span>
                  </button>
                  <button className="w-full p-4 flex justify-between items-center text-slate-800 hover:bg-slate-50 transition-colors">
                     <span className="text-sm font-medium">ברירת מחדל לזמנים</span>
                     <span className="text-slate-400 text-lg">›</span>
                  </button>
              </div>
           </div>

           <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-400 mr-2">התראות</h3>
              <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
                  <div className="p-4 flex justify-between items-center border-b border-slate-50">
                     <span className="text-sm font-medium text-slate-800">תזכורות SMS</span>
                     <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner transition-colors">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
                     </div>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                     <span className="text-sm font-medium text-slate-800">דוחות במייל</span>
                     <div className="w-11 h-6 bg-slate-200 rounded-full relative cursor-pointer shadow-inner">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
                     </div>
                  </div>
              </div>
           </div>
           
           <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-400 mr-2">נתונים</h3>
              <button className="w-full bg-white rounded-2xl shadow-soft border border-slate-100 p-4 flex justify-between items-center text-slate-800 hover:bg-slate-50 transition-colors">
                 <span className="text-sm font-medium">יצוא כל הנתונים (CSV)</span>
                 <span className="text-slate-400">↓</span>
              </button>
           </div>
        </div>
      </div>
      
      <div className="p-6 bg-white border-t border-slate-100">
         <button className="w-full border border-red-100 bg-red-50 text-red-600 py-3 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors">
            התנתק מהמערכת
         </button>
         <div className="text-center mt-4 text-[10px] text-slate-300">
            Synagogue Manager v2.0
         </div>
      </div>
    </div>
  );
};