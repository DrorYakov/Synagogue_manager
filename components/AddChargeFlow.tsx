import React, { useState, useEffect } from 'react';
import { Transaction, Member } from '../types';
import { UserPlus, ChevronDown } from 'lucide-react';

interface Props {
  onComplete: (transaction: Transaction) => void;
  onCancel: () => void;
  existingMembers: Member[];
  initialMemberId?: string;
}

const GUEST_VALUE = "_GUEST_";

export const AddChargeFlow: React.FC<Props> = ({ onComplete, onCancel, existingMembers, initialMemberId }) => {
    const [selectedMemberId, setSelectedMemberId] = useState(initialMemberId || '');
    const [guestName, setGuestName] = useState('');
    const [amount, setAmount] = useState('50');
    const [type, setType] = useState('Aliyah');
    const [detail, setDetail] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const isGuestMode = selectedMemberId === GUEST_VALUE;

    // Default to first member on load if no initialMemberId provided
    useEffect(() => {
        if (!selectedMemberId && existingMembers.length > 0) {
            setSelectedMemberId(existingMembers[0].id);
        }
    }, [existingMembers, selectedMemberId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let finalName = '';
        let finalMemberId: string | undefined = undefined;

        if (isGuestMode) {
            if (!guestName.trim()) {
                setError("נא להזין שם אורח");
                return;
            }
            finalName = guestName.trim() + " (אורח)";
        } else {
            const member = existingMembers.find(m => m.id === selectedMemberId);
            if (!member) {
                setError("נא לבחור מתפלל מהרשימה");
                return;
            }
            finalName = member.name;
            finalMemberId = member.id;
        }

        const newTransaction: Transaction = {
            id: Date.now().toString(),
            user: finalName,
            memberId: finalMemberId,
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
    <div className="flex flex-col h-full bg-paper-bg p-6 relative overflow-hidden">
        <div className="mb-8">
             <h2 className="text-2xl font-bold text-primary">חיוב מתפלל</h2>
             <p className="text-sm text-slate-500 mt-1">הזן את פרטי החיוב עבור חבר או אורח</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
            
            {/* Member Selection Section */}
            <div className="space-y-4">
                <div>
                    <label className={labelClasses}>בחר מתפלל</label>
                    <div className="relative">
                        <select 
                            value={selectedMemberId}
                            onChange={(e) => {
                                setSelectedMemberId(e.target.value);
                                if (e.target.value !== GUEST_VALUE) setGuestName('');
                            }}
                            className={`${inputClasses} appearance-none cursor-pointer pr-4 pl-10`}
                        >
                            <optgroup label="אפשרויות נוספות">
                                <option value={GUEST_VALUE}>➕ אורח חדש (לא ברשימה)</option>
                            </optgroup>
                            <optgroup label="חברי בית הכנסת">
                                {existingMembers.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </optgroup>
                        </select>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown size={18} />
                        </div>
                    </div>
                </div>

                {/* Guest Name Input - Animated visibility */}
                {isGuestMode && (
                    <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                        <label className={`${labelClasses} text-amber-600`}>שם האורח</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                className={`${inputClasses} border-amber-200 bg-amber-50/30 focus:border-amber-500 pr-10`}
                                placeholder="לדוגמה: משה כהן (לונדון)"
                                autoFocus
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500">
                                <UserPlus size={18} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Category Field */}
            <div>
                <label className={labelClasses}>סוג חיוב</label>
                <div className="relative">
                     <select 
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className={`${inputClasses} appearance-none cursor-pointer pr-4 pl-10`}
                    >
                        <option value="Aliyah">עלייה לתורה</option>
                        <option value="Maftir">מפטיר</option>
                        <option value="Petiha">פתיחת ההיכל</option>
                        <option value="Kiddush">קידוש</option>
                        <option value="Nader">נדר כללי</option>
                        <option value="Donation">תרומה</option>
                        <option value="Membership">דמי חבר</option>
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={18} />
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