import React from 'react';
import { Transaction } from '../types';

interface Props {
  onAddCharge: () => void;
  transactions: Transaction[];
  showSuccessBanner?: boolean;
  onToggleStatus?: (id: string) => void;
}

const getTransactionLabel = (type: Transaction['type'], detail?: string) => {
    const baseLabel = {
        'Aliyah': 'עלייה לתורה',
        'Maftir': 'מפטיר',
        'Petiha': 'פתיחת ההיכל',
        'Kiddush': 'קידוש',
        'Donation': 'תרומה',
        'Membership': 'דמי חבר',
        'Nader': 'נדר'
    }[type];
    
    return detail ? `${baseLabel} (${detail})` : baseLabel;
};

export const AdminDashboardList: React.FC<Props> = ({ onAddCharge, transactions, showSuccessBanner, onToggleStatus }) => {
  return (
    <div className="relative h-full flex flex-col bg-paper-bg">
      
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="bg-emerald-600 text-white px-4 py-3 shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-300 z-30">
             <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">✓</div>
                <span className="text-sm font-medium">החיוב נוסף בהצלחה</span>
             </div>
        </div>
      )}

      <div className="px-6 py-4">
        <h2 className="text-lg font-bold text-primary">פעולות אחרונות</h2>
      </div>

      {/* List Content */}
      <section className="flex-1 overflow-y-auto px-4 pb-20 space-y-3">
          {transactions.map((t) => (
            <div key={t.id} className="group bg-surface rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-blue-100 transition-all duration-200">
                <div className="flex items-center space-x-4 space-x-reverse">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-800 text-white flex items-center justify-center shadow-sm">
                        <span className="font-bold text-lg">{t.user.charAt(0)}</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 text-sm">{t.user}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                           <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'Paid' ? 'bg-emerald-500' : 'bg-gold'}`}></span>
                           {getTransactionLabel(t.type, t.detail)}
                        </p>
                    </div>
                </div>
                <div className="text-left flex flex-col items-end">
                    <p className="font-bold text-primary text-base">₪{t.amount}</p>
                    <button 
                        onClick={() => onToggleStatus && onToggleStatus(t.id)}
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/40 rounded-full"
                        title="לחץ לשינוי סטוס"
                    >
                        <span className="text-[10px] text-slate-400">{t.date}</span>
                        {t.status === 'Paid' && (
                             <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 rounded-full font-bold border border-emerald-200">שולם</span>
                        )}
                         {t.status === 'Pending' && (
                             <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded-full font-bold border border-amber-200">חוב</span>
                        )}
                    </button>
                </div>
            </div>
          ))}
          
          {/* Empty State / Placeholders */}
          {transactions.length < 5 && [1,2].map(i => (
            <div key={`placeholder-${i}`} className="bg-white/50 rounded-xl p-4 border border-dashed border-slate-200 flex items-center justify-between opacity-60">
                 <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 rounded-full bg-slate-100"></div>
                    <div className="space-y-2">
                        <div className="h-3 w-24 bg-slate-100 rounded"></div>
                        <div className="h-2 w-16 bg-slate-100 rounded"></div>
                    </div>
                </div>
            </div>
          ))}
      </section>

      {/* Floating Action Button */}
      <button 
        onClick={onAddCharge}
        className="absolute bottom-6 left-6 w-14 h-14 bg-gold hover:bg-amber-500 text-white rounded-full shadow-lg shadow-amber-600/30 flex items-center justify-center z-20 active:scale-95 transition-all duration-200"
      >
        <span className="text-3xl font-light pb-1">+</span>
      </button>
    </div>
  );
};