import React, { useMemo } from 'react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

export const FinanceView: React.FC<Props> = ({ transactions }) => {
  const stats = useMemo(() => {
    const collected = transactions
        .filter(t => t.status === 'Paid')
        .reduce((sum, t) => sum + t.amount, 0);

    const pendingTransactions = transactions.filter(t => t.status === 'Pending');
    const debt = pendingTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const uniqueDebtors = new Set(pendingTransactions.map(t => t.user));
    const debtorsCount = uniqueDebtors.size;

    return { collected, debt, debtorsCount };
  }, [transactions]);

  const totalPotential = stats.collected + stats.debt;
  const progressPercent = totalPotential > 0 ? (stats.collected / totalPotential) * 100 : 0;

  return (
    <div className="p-6 space-y-8 bg-paper-bg h-full overflow-y-auto">
       <h2 className="text-2xl font-black text-primary mb-2 tracking-tight">סקירה פיננסית</h2>

       {/* Summary Cards */}
       <div className="grid grid-cols-2 gap-5">
          <div className="bg-white p-6 rounded-3xl shadow-medium border border-slate-100 flex flex-col justify-between h-40 transform hover:-translate-y-1 transition-transform">
            <div className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">סה״כ נגבה</div>
            <div className="text-3xl font-black text-primary">₪{stats.collected.toLocaleString()}</div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden shadow-inner">
                <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-medium border border-slate-100 flex flex-col justify-between h-40 transform hover:-translate-y-1 transition-transform">
            <div className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">חובות פתוחים</div>
            <div className="text-3xl font-black text-red-500">₪{stats.debt.toLocaleString()}</div>
            <div className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg font-bold mt-2 self-start shadow-sm border border-red-100">{stats.debtorsCount} חייבים</div>
          </div>
       </div>

       {/* Graph */}
       <div className="bg-white rounded-[2rem] shadow-medium border border-slate-100 p-8">
         <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl text-slate-800 tracking-tight">הכנסות חודש נובמבר</h3>
            <button className="text-[11px] font-black text-primary bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 shadow-sm hover:shadow-soft transition-all">יצוא PDF</button>
         </div>
         <div className="space-y-4">
            <div className="flex justify-between items-end h-40 border-b-2 border-slate-50 pb-2 space-x-3 px-2">
               {[25, 55, 35, 95, 60, 75, 45].map((h, i) => (
                 <div key={i} className="w-full relative group">
                     <div 
                        className="bg-primary/80 w-full rounded-t-xl hover:bg-gold transition-all duration-300 cursor-pointer shadow-sm hover:shadow-medium" 
                        style={{ height: `${h}%` }}
                     ></div>
                 </div>
               ))}
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-black px-2 tracking-widest">
              <span>א</span><span>ב</span><span>ג</span><span>ד</span><span>ה</span><span>ו</span><span>ש</span>
            </div>
         </div>
       </div>

       {/* Expenses Section */}
       <div className="pb-8">
          <h3 className="font-black text-xl text-slate-800 mb-5 px-1 tracking-tight">הוצאות אחרונות</h3>
          <div className="space-y-4">
             {[
               { icon: '⚡', title: 'חברת חשמל', sub: 'חשבון דו-חודשי', amount: '3,200', color: 'orange' },
               { icon: '🧹', title: 'חברת ניקיון', sub: 'נקיון שבועי', amount: '450', color: 'blue' },
               { icon: '🍷', title: 'אושר עד', sub: 'מצרכים לקידוש', amount: '850', color: 'purple' }
             ].map((exp, idx) => (
               <div key={idx} className="bg-white rounded-2xl p-5 shadow-soft border border-slate-100 flex justify-between items-center hover:shadow-medium transition-shadow">
                  <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-${exp.color}-50 text-xl flex items-center justify-center shadow-inner`}>
                        {exp.icon}
                      </div>
                      <div className="flex flex-col">
                          <span className="font-black text-slate-800 text-base">{exp.title}</span>
                          <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">{exp.sub}</span>
                      </div>
                  </div>
                  <span className="font-black text-slate-900 text-lg">₪{exp.amount}-</span>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};