import React, { useState } from 'react';
import { PrayerTimesConfig } from '../types';

interface Props {
  onPay?: () => void;
  onMarkPaid?: () => void;
  prayerTimes?: PrayerTimesConfig;
}

export const MemberDebtView: React.FC<Props> = ({ onPay, onMarkPaid, prayerTimes }) => {
  const [isPaid, setIsPaid] = useState(false);

  const handlePay = () => {
      setIsPaid(true);
  };

  return (
    <div className="p-6 space-y-6 flex flex-col h-full bg-paper-bg">
      
      {/* Top Alert Banner */}
      {!isPaid && prayerTimes && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3 space-x-reverse shadow-sm">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex-shrink-0 flex items-center justify-center font-bold text-xs mt-0.5">i</div>
            <span className="text-primary text-sm font-medium leading-relaxed">
                {prayerTimes.message}
            </span>
          </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl p-8 shadow-soft border border-slate-100 flex flex-col items-center space-y-8 relative overflow-hidden">
         {/* Decorative top accent */}
         <div className={`absolute top-0 left-0 right-0 h-2 ${isPaid ? 'bg-emerald-500' : 'bg-gold'}`}></div>

         <div className="text-center w-full border-b border-slate-100 pb-4">
             <h2 className="text-xl font-bold text-slate-800">
                 {isPaid ? 'קבלה על תשלום' : 'חוב לתשלום'}
             </h2>
             <p className="text-slate-400 text-xs mt-1">מספר אסמכתא: #882910</p>
         </div>
         
         <div className="w-full text-center space-y-6">
             {isPaid ? (
                 <div className="py-8 flex flex-col items-center animate-in zoom-in duration-300">
                     <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mb-4 shadow-sm">✓</div>
                     <p className="text-slate-800 font-bold text-lg">התשלום התקבל בהצלחה</p>
                     <p className="text-slate-500 text-sm">תודה רבה על תרומתך!</p>
                 </div>
             ) : (
                 <div className="space-y-6">
                     <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <span className="block text-slate-500 text-xs uppercase tracking-wider mb-1">סכום לתשלום</span>
                        <span className="block text-4xl font-bold text-primary">₪100</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="text-right">
                            <span className="block text-slate-400 text-xs">סוג חיוב</span>
                            <span className="block text-slate-800 font-medium">עלייה לתורה</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-slate-400 text-xs">תאריך</span>
                            <span className="block text-slate-800 font-medium">שבת קודש</span>
                        </div>
                     </div>

                     <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-xs font-bold inline-block border border-amber-100">
                         ממתין לתשלום
                     </div>
                 </div>
             )}
         </div>
      </div>

      {/* Action Buttons */}
      {!isPaid && (
          <div className="mt-auto grid grid-cols-2 gap-4 pt-4">
              <button 
                onClick={handlePay}
                className="bg-primary text-white rounded-xl py-4 font-bold text-md shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all"
              >
                שלם באשראי
              </button>
              
              <button 
                onClick={handlePay}
                className="bg-white text-slate-700 border border-slate-200 rounded-xl py-4 font-bold text-md hover:bg-slate-50 transition-all"
              >
                סמן כשולם
              </button>
          </div>
      )}
      
      {isPaid && (
          <div className="mt-auto pt-4">
              <button 
                onClick={() => setIsPaid(false)}
                className="w-full bg-slate-100 text-slate-700 rounded-xl py-4 font-bold text-md hover:bg-slate-200 transition-colors"
              >
                  סגור אישור
              </button>
          </div>
      )}
    </div>
  );
};