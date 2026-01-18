import React, { useState } from 'react';
import { Member } from '../types';

interface Props {
  onSave: (member: { name: string }) => void;
  onCancel: () => void;
  existingMembers: Member[];
}

export const AddMemberForm: React.FC<Props> = ({ onSave, onCancel, existingMembers }) => {
  const [firstName, setFirstName] = useState('משה');
  const [lastName, setLastName] = useState('כהן');
  const [phone, setPhone] = useState('050-1234567');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    
    const isDuplicate = existingMembers.some(
        member => member.name === fullName
    );

    if (isDuplicate) {
        setError(`החבר '${fullName}' כבר קיים במערכת`);
        setTimeout(() => setError(null), 5000);
    } else if (firstName && lastName) {
        onSave({ name: fullName });
    }
  };

  const inputClasses = "w-full border border-slate-300 rounded-xl p-4 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200";
  const labelClasses = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="flex flex-col h-full bg-paper-bg p-6 relative">
       <div className="mb-8">
         <h2 className="text-2xl font-bold text-primary">הוספת חבר חדש</h2>
         <p className="text-sm text-slate-500 mt-1">מלא את הפרטים ליצירת כרטיס חבר</p>
       </div>

       <form onSubmit={handleSubmit} className="flex-1 space-y-6 relative">
          <div>
             <label className={labelClasses}>שם פרטי</label>
             <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClasses}
                placeholder="לדוגמה: יוני"
             />
          </div>

          <div>
             <label className={labelClasses}>שם משפחה</label>
             <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClasses}
                placeholder="לדוגמה: לוי"
             />
          </div>

          <div>
             <label className={labelClasses}>מספר טלפון</label>
             <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClasses}
                placeholder="050-0000000"
             />
          </div>

          <div className="pt-8 relative flex flex-col gap-3">
             <button 
                type="submit"
                className="w-full bg-primary text-white rounded-xl py-4 font-bold text-lg shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all"
             >
                שמור פרטי חבר
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