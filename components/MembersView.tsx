import React, { useState } from 'react';
import { Member } from '../types';

interface Props {
  members: Member[];
  highlightId?: string | null;
  onAddMember?: () => void;
  onUpdateMember?: (member: Member) => void;
}

export const MembersView: React.FC<Props> = ({ members, highlightId, onAddMember, onUpdateMember }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [noteText, setNoteText] = useState('');

  // Search Logic
  const filteredMembers = members.filter(m => 
      m.name.includes(searchQuery) || 
      (m.family && m.family.includes(searchQuery))
  );

  // Modal Handlers
  const handleMemberClick = (member: Member) => {
      setSelectedMember(member);
      setNoteText(member.notes || '');
  };

  const handleSaveNote = () => {
      if (selectedMember && onUpdateMember) {
          onUpdateMember({
              ...selectedMember,
              notes: noteText
          });
      }
      setSelectedMember(null);
  };

  return (
    <div className="flex flex-col h-full bg-paper-bg relative">
      {/* Search Header */}
      <div className="p-6 bg-white shadow-sm z-10 sticky top-0">
        <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-bold text-primary">כל החברים</h2>
            <span className="text-slate-400 text-xs font-medium">{filteredMembers.length} נמצאו</span>
        </div>
        <div className="relative">
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חפש שם או משפחה..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            {searchQuery && (
                <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                >
                    ✕
                </button>
            )}
        </div>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {filteredMembers.length > 0 ? (
            filteredMembers.map(m => {
            const isHighlighted = highlightId === m.id;
            const hasNote = m.notes && m.notes.length > 0;

            return (
                <div 
                    key={m.id} 
                    onClick={() => handleMemberClick(m)}
                    className={`p-4 rounded-xl flex items-center justify-between transition-all duration-300 cursor-pointer shadow-sm border relative overflow-hidden ${
                        isHighlighted 
                        ? 'bg-primary text-white border-primary transform scale-[1.02] shadow-lg' 
                        : 'bg-white text-slate-800 border-slate-100 hover:border-blue-200 hover:shadow-md'
                    }`}
                >
                    <div className="flex items-center space-x-4 space-x-reverse relative z-10">
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${
                            isHighlighted 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gradient-to-tr from-slate-100 to-white text-primary border border-slate-100'
                        }`}>
                            {m.avatar || m.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-base flex items-center gap-2">
                                {m.name}
                                {hasNote && !isHighlighted && (
                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded-full border border-amber-200" title="יש הערה">📝</span>
                                )}
                            </div>
                            <div className={`text-xs font-medium ${isHighlighted ? 'text-blue-200' : 'text-slate-500'}`}>
                                {m.status || 'פעיל'} • {m.family || 'משפחת ' + m.name.split(' ').pop()}
                            </div>
                        </div>
                    </div>
                    
                    {isHighlighted && (
                        <span className="text-[10px] uppercase font-bold bg-gold text-white px-2 py-0.5 rounded-full shadow-sm relative z-10">נוסף כעת</span>
                    )}

                    {/* Hint Arrow */}
                    {!isHighlighted && (
                         <span className="text-slate-300 text-xl transform group-hover:translate-x-1 transition-transform">›</span>
                    )}
                </div>
            );
            })
        ) : (
            <div className="py-12 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-slate-800 font-bold mb-1">לא נמצאו חברים</h3>
                <p className="text-slate-500 text-sm">נסה לחפש שם אחר או הוסף חבר חדש</p>
            </div>
        )}
        
        {/* Empty state placeholder for scrolling */}
        {filteredMembers.length > 0 && (
            <div className="py-8 text-center">
                <div className="w-2 h-2 bg-slate-300 rounded-full mx-auto mb-2"></div>
                <div className="text-xs text-slate-400">סוף הרשימה</div>
            </div>
        )}
      </div>

       {/* Floating Action Button */}
       <button 
        onClick={onAddMember}
        className="absolute bottom-6 left-6 w-14 h-14 bg-primary hover:bg-blue-800 text-white rounded-full shadow-lg shadow-blue-900/30 flex items-center justify-center z-20 active:scale-95 transition-all duration-200"
       >
        <span className="text-3xl font-light pb-1">+</span>
      </button>

      {/* Note Modal */}
      {selectedMember && (
          <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom duration-300">
                  <div className="flex justify-between items-center mb-6">
                      <div>
                          <h3 className="text-xl font-bold text-slate-800">{selectedMember.name}</h3>
                          <p className="text-xs text-slate-500">עריכת הערות גבאי</p>
                      </div>
                      <button onClick={() => setSelectedMember(null)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200">✕</button>
                  </div>
                  
                  <textarea 
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full h-32 border border-slate-200 rounded-xl p-4 text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none mb-6 text-sm leading-relaxed"
                    placeholder="הוסף הערה... (לדוגמה: צריך יזכור, אבא חולה, וכו')"
                  ></textarea>

                  <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={handleSaveNote}
                        className="bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-800"
                      >
                          שמור הערה
                      </button>
                      <button 
                        onClick={() => setSelectedMember(null)}
                        className="bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-50"
                      >
                          ביטול
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};