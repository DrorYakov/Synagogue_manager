import React, { useState } from 'react';
import { Transaction, Member } from '../types';

interface Props {
  onComplete: (transaction: Transaction) => void;
  onCancel: () => void;
  existingMembers: Member[];
}

export const AddChargeFlow: React.FC<Props> = ({ onComplete, onCancel, existingMembers }) => {
    const [memberName, setMemberName] = useState('');
    const [amount, setAmount] = useState('50');
    const [type, setType] = useState('Aliyah');
    const [detail, setDetail] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    // Suggest first member if none selected or keep empty
    React.useEffect(() => {
        if (!memberName && existingMembers.length > 0) {
            setMemberName(existingMembers[0].name);
        }
    }, [existingMembers]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: Check if member exists
        const memberExists = existingMembers.some(
            m => m.name.trim() === memberName.trim()
        );

        if (!memberExists) {
            setError(`שגיאה: החבר '${memberName}' לא נמצא במערכת`);
            setTimeout(() => setError(null), 5000);
            return;
        }

        const newTransaction: Transaction = {
            id: Date.now().toString(),
            user: memberName,
            amount: parseInt(amount) || 0,
            type: type as any,
            detail: detail || undefined,
            date: 'הרגע',
            timestamp: new Date(),
            status: 'Pending'
        };
        onComplete(newTransaction);
    };

    const inputClasses = "w-full border border-slate-300 rounded-xl p-4 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200";
    const labelClasses = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="flex flex-col h-full bg-paper-bg p-6 relative">
        <div className="mb-8">
             <h2 className="text-2xl font-bold text-primary">חיוב מתפלל</h2>
             <p className="text-sm text-slate-500 mt-1">הזן את פרטי החיוב או הנדר</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
            
            {/* Member Name Field */}
            <div>
                <label className={labelClasses}>שם המתפלל</label>
                <div className="relative">
                     <select 
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                    >
                        {existingMembers.map(m => (
                            <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        ▼
                    </div>
                </div>
            </div>

            {/* Category Field */}
            <div>
                <label className={labelClasses}>סוג חיוב</label>
                <div className="relative">
                     <select 
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                    >
                        <option value="Aliyah">עלייה לתורה</option>
                        <option value="Maftir">מפטיר</option>
                        <option value="Petiha">פתיחת ההיכל</option>
                        <option value="Kiddush">קידוש</option>
                        <option value="Nader">נדר כללי</option>
                        <option value="Donation">תרומה</option>
                        <option value="Membership">דמי חבר</option>
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        ▼
                    </div>
                </div>
            </div>

            {/* Detail Field (Optional) */}
             <div>
                <label className={labelClasses}>פירוט (אופציונלי)</label>
                <input 
                    type="text" 
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    className={inputClasses}
                    placeholder="לדוגמה: שלישי, לרפואת..."
                />
            </div>

            {/* Amount Field */}
            <div>
                <label className={labelClasses}>סכום (₪)</label>
                <div className="relative">
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={`${inputClasses} font-mono font-bold text-lg`}
                    />
                </div>
            </div>

            {/* Bottom Action */}
            <div className="mt-auto pt-6 flex flex-col gap-3">
                <button 
                    type="submit"
                    className="w-full bg-primary text-white rounded-xl py-4 font-bold text-lg shadow-lg shadow-blue-900/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                    רשום חיוב
                </button>
                <button 
                    type="button"
                    onClick={onCancel}
                    className="w-full text-slate-500 py-3 text-sm font-medium hover:text-slate-800 transition-colors"
                >
                    ביטול
                </button>
            </div>
        </form>

        {/* Toast Notification Layer */}
        {error && (
           <div className="absolute bottom-6 left-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
               <div className="bg-white border-r-4 border-red-500 p-4 rounded-lg shadow-2xl flex items-center justify-between">
                   <div className="flex items-center space-x-3 space-x-reverse">
                       <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold">!</div>
                       <div>
                           <span className="block text-slate-900 font-bold text-sm">שגיאה</span>
                           <span className="text-slate-500 text-xs">{error}</span>
                       </div>
                   </div>
                   <button onClick={() => setError(null)} className="text-slate-400 hover:text-slate-800">×</button>
               </div>
           </div>
       )}
    </div>
  );
};