import React from 'react';

export const FinanceView: React.FC = () => {
  return (
    <div className="p-6 space-y-8 bg-paper-bg h-full overflow-y-auto">
       <h2 className="text-2xl font-bold text-primary mb-2">סקירה פיננסית</h2>

       {/* Summary Cards */}
       <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-soft border border-slate-100 flex flex-col justify-between h-32">
            <div className="text-xs uppercase font-bold text-slate-400 mb-2">סה״כ נגבה</div>
            <div className="text-2xl font-bold text-primary">₪34,200</div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 w-[70%] h-full rounded-full"></div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-soft border border-slate-100 flex flex-col justify-between h-32">
            <div className="text-xs uppercase font-bold text-slate-400 mb-2">חובות פתוחים</div>
            <div className="text-2xl font-bold text-red-500">₪8,450</div>
            <div className="text-[10px] text-slate-400 mt-2">56 חייבים</div>
          </div>
       </div>

       {/* Weekly Chart */}
       <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">הכנסות חודש נובמבר</h3>
            <button className="text-xs font-bold text-primary bg-blue-50 px-2 py-1 rounded-md">יצוא דוח</button>
         </div>
         <div className="space-y-3">
            <div className="flex justify-between items-end h-32 border-b border-slate-100 pb-2 space-x-3 px-2">
               {[20, 45, 30, 90, 50, 60, 40].map((h, i) => (
                 <div key={i} className="w-full relative group">
                     <div 
                        className="bg-primary/80 w-full rounded-t-md hover:bg-gold transition-colors duration-300 cursor-pointer" 
                        style={{ height: `${h}%` }}
                     ></div>
                 </div>
               ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-medium px-2">
              <span>א</span><span>ב</span><span>ג</span><span>ד</span><span>ה</span><span>ו</span><span>ש</span>
            </div>
         </div>
       </div>

       {/* Recent Expenses List */}
       <div>
          <h3 className="font-bold text-lg text-slate-800 mb-4 px-1">הוצאות אחרונות</h3>
          <div className="space-y-3">
             <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-lg">⚡</div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-800">חברת חשמל</span>
                        <span className="text-[10px] text-slate-500">חשבון דו-חודשי</span>
                    </div>
                </div>
                <span className="font-bold text-slate-800">-₪3,200</span>
             </div>
             
             <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-lg">🧹</div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-800">חברת ניקיון</span>
                        <span className="text-[10px] text-slate-500">נקיון שבועי</span>
                    </div>
                </div>
                <span className="font-bold text-slate-800">-₪450</span>
             </div>

             <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center text-lg">🍷</div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-800">אושר עד</span>
                        <span className="text-[10px] text-slate-500">מצרכים לקידוש</span>
                    </div>
                </div>
                <span className="font-bold text-slate-800">-₪850</span>
             </div>
          </div>
       </div>
    </div>
  );
};