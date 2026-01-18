import React, { useState, useRef } from 'react';
import { PrayerTimesConfig } from '../types';

interface Props {
  initialData: PrayerTimesConfig;
  onSave: (data: PrayerTimesConfig) => void;
  onCancel: () => void;
}

export const UpdateTimesView: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
    const [shacharit, setShacharit] = useState(initialData.shacharit);
    const [mincha, setMincha] = useState(initialData.mincha);
    const [arvit, setArvit] = useState(initialData.arvit || '20:00');
    const [message, setMessage] = useState(initialData.message);

    const shacharitRef = useRef<HTMLInputElement>(null);
    const minchaRef = useRef<HTMLInputElement>(null);
    const arvitRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        onSave({ shacharit, mincha, arvit, message });
    };

    const handleTimeClick = (ref: React.RefObject<HTMLInputElement>) => {
        if (ref.current) {
            try {
                if ('showPicker' in (ref.current as any)) {
                    (ref.current as any).showPicker();
                } else {
                    ref.current.focus();
                }
            } catch (error) {
                console.log('Picker open failed', error);
            }
        }
    };

    const inputClasses = "bg-white border border-slate-200 rounded-xl p-3 w-32 text-center text-lg font-bold text-primary shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all cursor-pointer hover:bg-slate-50";

  return (
    <div className="flex flex-col h-full bg-paper-bg p-6">
        
        {/* Date Selector */}
        <div className="mb-8 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    30
                </div>
                <div>
                    <div className="font-bold text-slate-800">ראש חודש</div>
                    <div className="text-xs text-slate-500">יום שני</div>
                </div>
            </div>
            <button className="text-primary text-sm font-medium">שינוי</button>
        </div>

        {/* Time List */}
        <div className="space-y-4 mb-8 bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">זמני תפילה</h3>
            
            {/* Row 1: Shacharit */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <span className="font-medium text-slate-700 text-lg">שחרית</span>
                <input 
                    ref={shacharitRef}
                    type="time" 
                    value={shacharit}
                    onChange={(e) => setShacharit(e.target.value)}
                    onClick={() => handleTimeClick(shacharitRef)}
                    className={inputClasses}
                />
            </div>

            {/* Row 2: Mincha */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <span className="font-medium text-slate-700 text-lg">מנחה</span>
                 <input 
                    ref={minchaRef}
                    type="time" 
                    value={mincha}
                    onChange={(e) => setMincha(e.target.value)}
                    onClick={() => handleTimeClick(minchaRef)}
                    className={inputClasses}
                />
            </div>

             {/* Row 3: Arvit */}
             <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700 text-lg">ערבית</span>
                 <input 
                    ref={arvitRef}
                    type="time" 
                    value={arvit}
                    onChange={(e) => setArvit(e.target.value)}
                    onClick={() => handleTimeClick(arvitRef)}
                    className={inputClasses}
                />
            </div>
        </div>

        {/* Announcement Section */}
        <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 mr-1">עדכון ללוח מודעות</label>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)} 
                className="w-full border border-slate-300 rounded-xl p-4 bg-white text-slate-800 min-h-[120px] shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none transition-all"
                placeholder="כתוב כאן הודעה לציבור..."
            />
        </div>

        {/* Bottom Action */}
        <div className="mt-6 grid grid-cols-2 gap-4">
            <button 
                onClick={handleSubmit}
                className="w-full bg-primary text-white rounded-xl py-4 font-bold text-lg shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all"
            >
                שמור שינויים
            </button>
            <button 
                onClick={onCancel}
                className="w-full bg-white text-slate-700 border border-slate-200 rounded-xl py-4 font-bold text-lg hover:bg-slate-50 transition-colors"
            >
                ביטול
            </button>
        </div>
    </div>
  );
};