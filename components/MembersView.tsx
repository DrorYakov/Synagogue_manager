import React, { useState, useMemo, useEffect } from 'react';
import { Member } from '../types';
import { Search, UserPlus, Users, Map as MapIcon, X, Plus, AlertCircle, ArrowRightLeft, CreditCard, Edit3, Check } from 'lucide-react';

interface Props {
  members: Member[];
  highlightId?: string | null;
  onAddMember?: () => void;
  onUpdateMember?: (member: Member) => void;
  onChargeMember?: (memberId: string) => void;
}

export const MembersView: React.FC<Props> = ({ members, highlightId, onAddMember, onUpdateMember, onChargeMember }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [noteText, setNoteText] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [animateProgress, setAnimateProgress] = useState(false);
  
  // Map Specific State
  const [isEditMode, setIsEditMode] = useState(false);
  const [seatToAssign, setSeatToAssign] = useState<number | null>(null);
  const [assignSearchQuery, setAssignSearchQuery] = useState('');

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
        m.name.includes(searchQuery) || 
        (m.family && m.family.includes(searchQuery))
    );
  }, [members, searchQuery]);

  const seatAssignments = useMemo(() => {
    const assignments: Record<number, Member> = {};
    members.forEach(member => {
        if (member.seatNumber) {
            assignments[member.seatNumber] = member;
        }
    });
    return assignments;
  }, [members]);

  const totalSeats = 60;
  const occupiedCount = Object.keys(seatAssignments).length;
  const occupancyRate = Math.round((occupiedCount / totalSeats) * 100);

  useEffect(() => {
      if (viewMode === 'map') {
          const timer = setTimeout(() => setAnimateProgress(true), 100);
          return () => clearTimeout(timer);
      } else {
          setAnimateProgress(false);
      }
  }, [viewMode]);

  const getOccupancyColor = () => {
      if (occupancyRate > 90) return 'bg-red-500';
      if (occupancyRate >= 75) return 'bg-amber-500';
      return 'bg-emerald-500';
  };

  const membersForAssignment = useMemo(() => {
    let list = members;
    if (assignSearchQuery) {
        list = list.filter(m => 
            m.name.includes(assignSearchQuery) || 
            (m.family && m.family.includes(assignSearchQuery))
        );
    }
    return [...list].sort((a, b) => {
        const aSeated = a.seatNumber !== undefined;
        const bSeated = b.seatNumber !== undefined;
        if (aSeated === bSeated) return a.name.localeCompare(b.name);
        return aSeated ? 1 : -1;
    });
  }, [members, assignSearchQuery]);

  const handleMemberClick = (member: Member) => {
      if (!isEditMode) {
        setSelectedMember(member);
        setNoteText(member.notes || '');
      }
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

  const handleAssignMember = (member: Member) => {
      if (seatToAssign && onUpdateMember) {
          onUpdateMember({
              ...member,
              seatNumber: seatToAssign
          });
          setSeatToAssign(null);
          setAssignSearchQuery('');
      }
  };

  const handleUnassignMember = (member: Member, e: React.MouseEvent) => {
      e.stopPropagation();
      if (onUpdateMember) {
          onUpdateMember({
              ...member,
              seatNumber: undefined
          });
      }
  };

  const renderSeat = (seatNum: number) => {
      const member = seatAssignments[seatNum];
      const isOccupied = !!member;
      
      return (
          <button
              key={seatNum}
              onClick={() => {
                  if (isEditMode) {
                      if (!isOccupied) setSeatToAssign(seatNum);
                  } else {
                      if (member) handleMemberClick(member);
                  }
              }}
              disabled={!isEditMode && !isOccupied}
              className={`
                  relative aspect-square rounded-xl border flex flex-col items-center justify-center transition-all duration-200 overflow-hidden group
                  ${isOccupied 
                      ? 'bg-primary/5 border-primary/20 shadow-soft' 
                      : isEditMode 
                        ? 'bg-white border-dashed border-slate-300 hover:border-amber-500 hover:bg-amber-50 cursor-pointer animate-pulse shadow-sm' 
                        : 'bg-slate-50 border-slate-100 opacity-60'
                  }
                  ${!isEditMode && isOccupied ? 'hover:bg-primary/10 hover:scale-[1.02] active:scale-95 cursor-pointer hover:shadow-medium' : ''}
              `}
          >
              <span className={`absolute top-1 left-2 text-[8px] font-bold ${isOccupied ? 'text-primary/30' : 'text-slate-300'}`}>
                  {seatNum}
              </span>

              {isOccupied ? (
                  <>
                      {isEditMode && (
                          <div 
                            onClick={(e) => handleUnassignMember(member, e)}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-bl-xl z-20 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer shadow-md"
                          >
                              <X size={12} strokeWidth={3} />
                          </div>
                      )}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-800 text-white flex items-center justify-center text-xs font-bold shadow-md mb-1 ring-2 ring-white">
                          {member.avatar || member.name.charAt(0)}
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 truncate w-full px-0.5 text-center leading-tight">
                          {member.name.split(' ')[0]}
                      </span>
                  </>
              ) : (
                  isEditMode ? (
                      <div className="text-slate-300 group-hover:text-amber-500 transition-colors">
                          <Plus size={20} />
                      </div>
                  ) : (
                    <span className="text-[8px] text-slate-300">פנוי</span>
                  )
              )}
          </button>
      );
  };

  return (
    <div className="flex flex-col h-full bg-paper-bg relative overflow-hidden">
      {/* Header - Strictly solid background and high z-index */}
      <div className="flex-none p-4 shadow-medium z-[50] bg-white border-b border-slate-200 space-y-3 transition-colors duration-300">
        
        {isEditMode && (
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 shadow-[0_2px_10px_rgba(251,191,36,0.3)]"></div>
        )}

        <div className="flex justify-between items-center pt-1">
            <div className="flex items-center gap-2">
                 <h2 className={`text-xl font-bold transition-colors ${isEditMode ? 'text-amber-800' : 'text-primary'}`}>
                    {isEditMode ? 'עריכת מקומות' : 'ניהול מתפללים'}
                 </h2>
                 {isEditMode && <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold animate-pulse shadow-sm">מצב עריכה</span>}
            </div>
        </div>
        
        {/* Segmented Control */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-inner">
            <button 
                onClick={() => { setViewMode('list'); setIsEditMode(false); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                    ? 'bg-white text-primary shadow-soft' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                <Users size={16} />
                רשימה
            </button>
            <button 
                onClick={() => setViewMode('map')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                    viewMode === 'map' 
                    ? 'bg-white text-primary shadow-soft' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                <MapIcon size={16} />
                מפה
            </button>
        </div>

        {/* Search Bar (List Mode Only) */}
        {viewMode === 'list' && (
            <div className="relative group">
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="חיפוש מתפלל..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-4 pr-10 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm group-hover:shadow-soft"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
        )}
      </div>

      {/* Content Area - Scrollable */}
      <div className={`flex-1 overflow-y-auto ${isEditMode ? 'bg-amber-50/20' : 'bg-slate-50/50'} relative`}>
        {viewMode === 'list' ? (
             <div className="p-4 space-y-4 pb-32 animate-in slide-in-from-right duration-300">
                {filteredMembers.length > 0 ? (
                    filteredMembers.map(m => {
                    const isHighlighted = highlightId === m.id;
                    const hasNote = m.notes && m.notes.length > 0;

                    return (
                        <div 
                            key={m.id} 
                            onClick={() => handleMemberClick(m)}
                            className={`p-4 rounded-2xl flex items-center justify-between transition-all duration-300 cursor-pointer border relative overflow-hidden ${
                                isHighlighted 
                                ? 'bg-primary text-white border-primary transform scale-[1.02] shadow-intense' 
                                : 'bg-white text-slate-800 border-slate-100 hover:border-blue-200 shadow-soft hover:shadow-medium hover:-translate-y-0.5'
                            }`}
                        >
                            <div className="flex items-center space-x-4 space-x-reverse relative z-10">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0 ${
                                    isHighlighted ? 'bg-white/20 text-white' : 'bg-slate-100 text-primary'
                                }`}>
                                    {m.avatar || m.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-base flex items-center gap-2">
                                        {m.name}
                                        {hasNote && !isHighlighted && <span className="text-[12px] drop-shadow-sm">📝</span>}
                                    </div>
                                    <div className={`text-xs ${isHighlighted ? 'text-blue-200' : 'text-slate-500'}`}>
                                        {m.seatNumber ? `מושב ${m.seatNumber}` : 'ללא מקום'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                    })
                ) : (
                    <div className="py-24 text-center text-slate-400 italic">לא נמצאו תוצאות לחיפוש</div>
                )}
             </div>
        ) : (
            // MAP MODE
            <div className="p-4 pb-32 animate-in zoom-in duration-300">
                
                {/* Prominent Edit Seats Button - Positioned above occupancy card as requested */}
                <div className="mb-4">
                  <button 
                      onClick={() => setIsEditMode(!isEditMode)}
                      className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide shadow-medium transition-all flex items-center justify-center gap-3 border active:scale-[0.98] ${
                          isEditMode 
                          ? 'bg-amber-500 text-white border-amber-600 shadow-amber-200 hover:bg-amber-600' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:shadow-medium'
                      }`}
                  >
                      {isEditMode ? (
                        <>
                          <Check size={20} strokeWidth={3} />
                          שמור שינויים
                        </>
                      ) : (
                        <>
                          <Edit3 size={18} />
                          עריכת מקומות ישיבה
                        </>
                      )}
                  </button>
                </div>

                {/* Occupancy Card */}
                <div className="mb-6 bg-white p-5 rounded-2xl shadow-medium border border-slate-100">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-right">תפוסת מושבים</span>
                        <span className="text-sm font-bold text-slate-800">
                            {occupancyRate}% <span className="text-slate-400 text-xs font-normal">({occupiedCount}/{totalSeats})</span>
                        </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)] ${getOccupancyColor()}`}
                            style={{ width: animateProgress ? `${occupancyRate}%` : '0%' }}
                        ></div>
                    </div>
                </div>

                {/* Edit Mode Instruction */}
                {isEditMode && (
                    <div className="mb-6 flex items-center gap-2 text-[11px] font-bold text-amber-800 bg-amber-100/50 p-3 rounded-xl border border-amber-200/50 animate-pulse">
                        <AlertCircle size={16} />
                        <span>לחץ על מושב פנוי לשיבוץ, או על X להסרה.</span>
                    </div>
                )}

                {/* Aron Kodesh Visual */}
                <div className="w-full max-w-[80%] mx-auto mb-8 relative group cursor-default">
                    <div className="h-12 bg-gradient-to-b from-white to-amber-50 border-x border-t border-amber-200 rounded-t-full flex items-end justify-center shadow-medium z-10 relative">
                        <div className="text-gold text-2xl drop-shadow-md mb-1">🕎</div>
                    </div>
                    <div className="h-2.5 w-[106%] -mr-[3%] bg-amber-700 rounded shadow-lg relative z-20"></div>
                    <div className="text-center mt-2">
                        <span className="text-[10px] font-black text-amber-800/40 uppercase tracking-[0.2em]">מזרח</span>
                    </div>
                </div>

                {/* Sections */}
                <div className="mb-8">
                     <div className="flex items-center gap-3 mb-4 px-2 opacity-60">
                        <div className="h-px bg-slate-400 flex-1"></div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">עזרת גברים</span>
                        <div className="h-px bg-slate-400 flex-1"></div>
                     </div>
                     <div className="grid grid-cols-4 gap-4">
                         {Array.from({ length: 20 }, (_, i) => renderSeat(i + 1))}
                         <div className="col-span-4 py-6 flex items-center justify-center">
                             <div className="w-28 h-20 border-2 border-double border-primary/30 rounded-2xl bg-white flex items-center justify-center shadow-medium transform hover:scale-105 transition-transform">
                                 <span className="text-3xl drop-shadow-sm">📜</span>
                             </div>
                         </div>
                         {Array.from({ length: 20 }, (_, i) => renderSeat(i + 21))}
                     </div>
                </div>

                <div className="mb-8 bg-purple-50/40 p-5 rounded-3xl border border-purple-100 shadow-soft">
                     <div className="flex items-center gap-3 mb-4 px-2 opacity-60">
                        <div className="h-px bg-purple-300 flex-1"></div>
                        <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">עזרת נשים</span>
                        <div className="h-px bg-purple-300 flex-1"></div>
                     </div>
                     <div className="grid grid-cols-4 gap-4">
                         {Array.from({ length: 20 }, (_, i) => renderSeat(i + 41))}
                     </div>
                </div>
            </div>
        )}
      </div>

       {/* Floating Action Button */}
       <div className="absolute bottom-8 left-8 z-[60]">
           <button 
            onClick={onAddMember}
            className="w-16 h-16 bg-primary hover:bg-blue-800 text-white rounded-full shadow-fab flex items-center justify-center active:scale-95 transition-all duration-300 border-4 border-white hover:rotate-6"
            title="מתפלל חדש"
           >
            <UserPlus size={28} className="drop-shadow-sm" />
          </button>
       </div>

      {/* Details/Notes Modal */}
      {selectedMember && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedMember(null)}>
              <div 
                className="bg-white w-full max-w-md rounded-t-[2.5rem] shadow-intense p-8 animate-in slide-in-from-bottom duration-500 mb-0 pb-safe"
                onClick={(e) => e.stopPropagation()}
              >
                  <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mb-8 shadow-inner"></div>
                  <div className="flex justify-between items-center mb-8">
                      <div>
                          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{selectedMember.name}</h3>
                          <div className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                             {selectedMember.seatNumber && <span className="bg-primary text-white px-3 py-1 rounded-full font-bold text-[10px] shadow-sm">מושב {selectedMember.seatNumber}</span>}
                             <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold text-[10px] shadow-sm">{selectedMember.status || 'פעיל'}</span>
                          </div>
                      </div>
                      <button onClick={() => setSelectedMember(null)} className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 shadow-sm transition-all">✕</button>
                  </div>

                  <button 
                    onClick={() => {
                        if (onChargeMember) onChargeMember(selectedMember.id);
                        setSelectedMember(null);
                    }}
                    className="w-full mb-8 bg-gold text-white py-4.5 rounded-[1.25rem] font-black text-lg flex items-center justify-center gap-3 shadow-fab hover:bg-amber-600 transition-all active:scale-[0.98] tracking-wide"
                  >
                    <CreditCard size={22} className="drop-shadow-sm" />
                    חיוב חדש למתפלל
                  </button>

                  <div className="space-y-3 mb-8">
                    <label className="text-[10px] font-black text-slate-400 mr-1 uppercase tracking-widest">הערות גבאי חסויות</label>
                    <textarea 
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full h-32 border border-slate-200 rounded-2xl p-4 text-slate-800 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-inner resize-none font-medium"
                        placeholder="רשום כאן הערות חשובות..."
                    ></textarea>
                  </div>

                  <button onClick={handleSaveNote} className="w-full bg-primary text-white py-4.5 rounded-2xl font-black text-lg shadow-fab active:scale-95 transition-all">שמור וסגור</button>
              </div>
          </div>
      )}

      {/* Seat Assignment Modal (Edit Mode) */}
      {seatToAssign && (
          <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white w-full max-w-md rounded-t-3xl shadow-intense flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300">
                 <div className="p-6 border-b border-slate-100 flex-none bg-amber-50 rounded-t-3xl">
                     <div className="w-12 h-1.5 bg-slate-300/50 rounded-full mx-auto mb-6"></div>
                     <div className="flex justify-between items-center mb-4">
                         <div>
                            <h3 className="text-xl font-bold text-slate-800">שיבוץ למושב</h3>
                            <p className="text-xs text-slate-500 mt-1">בחר מתפלל לשיבוץ במושב זה</p>
                         </div>
                         <div className="flex flex-col items-center justify-center bg-white p-2 rounded-xl shadow-medium border border-amber-100">
                             <span className="text-xs text-amber-600 font-bold uppercase">מושב</span>
                             <span className="text-2xl font-black text-amber-600 leading-none">{seatToAssign}</span>
                         </div>
                     </div>
                     <div className="relative">
                        <input 
                            type="text" 
                            value={assignSearchQuery}
                            onChange={(e) => setAssignSearchQuery(e.target.value)}
                            placeholder="חפש חבר לשיבוץ..." 
                            className="w-full bg-white border border-amber-200 rounded-xl p-3 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm"
                            autoFocus
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                     </div>
                 </div>
                 <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50">
                     {membersForAssignment.length > 0 ? (
                         membersForAssignment.map(m => {
                             const isSeated = m.seatNumber !== undefined;
                             const isCurrent = m.seatNumber === seatToAssign;
                             if (isCurrent) return null;
                             return (
                                <button 
                                    key={m.id}
                                    onClick={() => handleAssignMember(m)}
                                    className={`w-full p-4 rounded-xl border flex items-center justify-between group transition-all duration-200 ${
                                        isSeated 
                                        ? 'bg-white border-slate-100 hover:border-amber-200 hover:bg-amber-50 opacity-90' 
                                        : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 shadow-soft'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors ${
                                            isSeated 
                                            ? 'bg-slate-100 text-slate-500 group-hover:bg-amber-200 group-hover:text-amber-800' 
                                            : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 group-hover:text-emerald-800'
                                        }`}>
                                            {m.avatar || m.name.charAt(0)}
                                        </div>
                                        <div className="text-right truncate">
                                            <span className="font-bold text-slate-700 block truncate">{m.name}</span>
                                            {isSeated ? (
                                                <span className="text-[10px] text-amber-600 flex items-center gap-1">
                                                    <ArrowRightLeft size={10} />
                                                    יועבר ממושב {m.seatNumber}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-emerald-600 font-medium">זמין לשיבוץ</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                        isSeated 
                                        ? 'bg-slate-50 text-slate-300 group-hover:bg-amber-500 group-hover:text-white'
                                        : 'bg-emerald-50 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white'
                                    }`}>
                                        {isSeated ? <ArrowRightLeft size={14} /> : <Plus size={18} strokeWidth={3} />}
                                    </div>
                                </button>
                             );
                         })
                     ) : (
                         <div className="text-center py-12 text-slate-400 text-sm">לא נמצאו תוצאות</div>
                     )}
                 </div>
                 <div className="p-4 border-t border-slate-100 flex-none pb-safe bg-white shadow-medium">
                     <button 
                        onClick={() => { setSeatToAssign(null); setAssignSearchQuery(''); }}
                        className="w-full py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
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