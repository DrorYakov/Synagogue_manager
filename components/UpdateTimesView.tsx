import React, { useState, useRef, useMemo } from 'react';
import { PrayerTimesConfig } from '../types';
import { Calendar, Sun, Sunset, Sunrise } from 'lucide-react';

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
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const shacharitRef = useRef<HTMLInputElement>(null);
    const minchaRef = useRef<HTMLInputElement>(null);
    const arvitRef = useRef<HTMLInputElement>(null);
    const dateInputRef = useRef<HTMLInputElement>(null);

    // Mock sunrise/sunset calculation based on the day of year
    const sunTimes = useMemo(() => {
        const date = new Date(selectedDate);
        const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        
        // Very rough approximation for Mediterranean latitude
        // Sunrise: earliest ~04:45 (day 172), latest ~06:45 (day 355)
        const sunriseMinutes = 345 + 60 * Math.cos((dayOfYear + 10) * 2 * Math.PI / 365);
        // Sunset: earliest ~16:40 (day 355), latest ~19:45 (day 172)
        const sunsetMinutes = 1090 - 90 * Math.cos((dayOfYear + 10) * 2 * Math.PI / 365);

        const formatMinutes = (m: number) => {
            const hrs = Math.floor(m / 60);
            const mins = Math.floor(m % 60);
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        };

        return {
            sunrise: formatMinutes(sunriseMinutes),
            sunset: formatMinutes(sunsetMinutes),
            displayDate: date.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })
        };
    }, [selectedDate]);

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

    const handleDateClick = () => {
        if (dateInputRef.current) {
            try {
                if ('showPicker' in (dateInputRef.current as any)) {
                    (dateInputRef.current as any).showPicker();
                } else {
                    dateInputRef.current.focus();
                }
            } catch (error) {
                dateInputRef.current.focus();
            }
        }
    };

    const inputClasses = "bg-white border border-slate-200 rounded-xl p-3 w-32 text-center text-lg font-bold text-primary shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all cursor-pointer hover:bg-slate-50";

  return (
    <div className="flex flex-col h-full bg-paper-bg p-6 overflow-y-auto">
        
        {/* Sun Times Selector (Replacing Rosh Chodesh) */}
        <div 
            onClick={handleDateClick}
            className="mb-8 bg-white p-5 rounded-2xl shadow-soft border border-slate-100 cursor-pointer hover:border-primary/30 transition-all active:scale-[0.98] group"
        >
            <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <div className="font-bold text-slate-800 text-sm">{sunTimes.displayDate}</div>
                        <div className="text-[10px] text-slate-400 font-medium">לחץ לשינוי תאריך</div>
                    </div>
                </div>
                {/* Hidden Date Input */}
                <input 
                    ref={dateInputRef}
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="absolute opacity-0 pointer-events-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                            <Sunrise size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-500">זריחה</span>
                    </div>
                    <span className="text-lg font-black text-amber-700">{sunTimes.sunrise}</span>
                </div>
                <div className="flex items-center justify-between bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Sunset size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-500">שקיעה</span>
                    </div>
                    <span className="text-lg font-black text-blue-700">{sunTimes.sunset}</span>
                </div>
            </div>
        </div>

        {/* Time List */}
        <div className="space-y-4 mb-8 bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">זמני תפילה בבית הכנסת</h3>
            
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
        <div className="mt-6 grid grid-cols-2 gap-4 pb-4">
            <button 
                onClick={handleSubmit}
                className="w-full bg-primary text-white rounded-xl py-4 font-bold text-lg shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-[0.98]"
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