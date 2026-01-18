import React, { useState, useMemo } from 'react';
import { Member } from '../types';
import { Search, UserPlus, Users, Map as MapIcon, X, Plus, AlertCircle, ArrowRightLeft } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // Map Specific State
  const [isEditMode, setIsEditMode] = useState(false);
  const [seatToAssign, setSeatToAssign] = useState<number | null>(null);
  const [assignSearchQuery, setAssignSearchQuery] = useState('');

  // Filtered list for the main search
  const filteredMembers = useMemo(() => {
    return members.filter(m => 
        m.name.includes(searchQuery) || 
        (m.family && m.family.includes(searchQuery))
    );
  }, [members, searchQuery]);

  // Derived state: Map seat numbers to members
  const seatAssignments = useMemo(() => {
    const assignments: Record<number, Member> = {};
    members.forEach(member => {
        if (member.seatNumber) {
            assignments[member.seatNumber] = member;
        }
    });
    return assignments;
  }, [members]);

  // Logic for Assignment Modal List (Smart Filter + Quick Swap)
  const membersForAssignment = useMemo(() => {
    let list = members;
    
    // Filter by search if exists
    if (assignSearchQuery) {
        list = list.filter(m => 
            m.name.includes(assignSearchQuery) || 
            (m.family && m.family.includes(assignSearchQuery))
        );
    }

    // Sort: Unseated first, then alphabetical
    return [...list].sort((a, b) => {
        const aSeated = a.seatNumber !== undefined;
        const bSeated = b.seatNumber !== undefined;
        if (aSeated === bSeated) return a.name.localeCompare(b.name);
        return aSeated ? 1 : -1;
    });
  }, [members, assignSearchQuery]);

  // Handlers
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
          // This handles both new assignment and quick swap (overwriting seatNumber)
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
                      ? 'bg-primary/5 border-primary/20 shadow-sm' 
                      : isEditMode 
                        ? 'bg-white border-dashed border-slate-300 hover:border-amber-500 hover:bg-amber-50 cursor-pointer animate-pulse' 
                        : 'bg-slate-50 border-slate-100 opacity-60'
                  }
                  ${!isEditMode && isOccupied ? 'hover:bg-primary/10 hover:scale-[1.02] active:scale-95 cursor-pointer' : ''}
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
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-bl-xl z-20 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer shadow-sm"
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
    <div className="flex flex-col h-full bg-paper-bg relative">
      {/* Header */}
      <div className={`p-4 shadow-sm z-10 sticky top-0 space-y-3 transition-colors duration-300 ${isEditMode ? 'bg-amber-50 border-b border-amber-200' : 'bg-white'}`}>
        
        {/* Edit Mode Alert Banner */}
        {isEditMode && (
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300"></div>
        )}

        <div className="flex justify-between items-center pt-1">
            <div className="flex items-center gap-2">
                 <h2 className={`text-xl font-bold transition-colors ${isEditMode ? 'text-amber-800' : 'text-primary'}`}>
                    {isEditMode ? 'עריכת מקומות' : 'ניהול מקומות'}
                 </h2>
                 {isEditMode && <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold animate-pulse">מצב עריכה</span>}
            </div>
            
            {viewMode === 'map' && (
                <button 
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                        isEditMode 
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-900/20 hover:bg-amber-600' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    {isEditMode ? 'שמור שינויים' : '✏️ עריכת מקומות'}
                </button>
            )}
        </div>
        
        {/* Segmented Control */}
        <div className="flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 backdrop-blur-sm">
            <button 
                onClick={() => { setViewMode('list'); setIsEditMode(false); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                    ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' 
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
                    ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                <MapIcon size={16} />
                מפה
            </button>
        </div>

        {/* Search Bar (List Mode Only) */}
        {viewMode === 'list' && (
            <div className="relative">
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="חיפוש מתפלל..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
        )}
        
        {/* Edit Mode Instruction */}
        {viewMode === 'map' && isEditMode && (
            <div className="flex items-center gap-2 text-xs text-amber-800/70 bg-amber-100/50 p-2 rounded-lg border border-amber-100">
                <AlertCircle size={14} />
                <span>לחץ על מושב פנוי כדי לשבץ, או על X כדי להסיר.</span>
            </div>
        )}
      </div>

      {/* Content Area */}
      <div className={`flex-1 overflow-y-auto ${isEditMode ? 'bg-amber-50/30' : 'bg-slate-50/50'}`}>
        {viewMode === 'list' ? (
             <div className="p-4 space-y-3 pb-24 animate-in slide-in-from-right duration-300">
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
                                : 'bg-white text-slate-800 border-slate-100 hover:border-blue-200'
                            }`}
                        >
                            <div className="flex items-center space-x-4 space-x-reverse relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-md shadow-sm flex-shrink-0 ${
                                    isHighlighted ? 'bg-white/20 text-white' : 'bg-slate-100 text-primary'
                                }`}>
                                    {m.avatar || m.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-sm flex items-center gap-2">
                                        {m.name}
                                        {hasNote && !isHighlighted && <span className="text-[10px]">📝</span>}
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
                    <div className="py-12 text-center text-slate-400">לא נמצאו תוצאות</div>
                )}
             </div>
        ) : (
            // MAP MODE
            <div className="p-4 pb-32 animate-in zoom-in duration-300">
                
                {/* Visual Header - Aron Kodesh */}
                <div className="w-full max-w-[80%] mx-auto mb-6 relative group cursor-default">
                    <div className="h-10 bg-gradient-to-b from-white to-amber-50 border-x border-t border-amber-200 rounded-t-full flex items-end justify-center shadow-sm z-10 relative">
                        <div className="text-gold text-lg drop-shadow-sm mb-1">🕎</div>
                    </div>
                    <div className="h-2 w-[104%] -mr-[2%] bg-amber-700 rounded shadow-md relative z-20"></div>
                    <div className="text-center mt-1">
                        <span className="text-[9px] font-bold text-amber-800/50 uppercase tracking-widest">מזרח</span>
                    </div>
                </div>

                {/* Main Hall (Seats 1-40) */}
                <div className="mb-8">
                     <div className="flex items-center gap-2 mb-3 px-2 opacity-50">
                        <div className="h-px bg-slate-300 flex-1"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">עזרת גברים</span>
                        <div className="h-px bg-slate-300 flex-1"></div>
                     </div>
                     
                     <div className="grid grid-cols-4 gap-3">
                         {/* Rows 1-5 */}
                         {Array.from({ length: 20 }, (_, i) => renderSeat(i + 1))}
                         
                         {/* Bimah Break */}
                         <div className="col-span-4 py-4 flex items-center justify-center">
                             <div className="w-24 h-16 border-2 border-double border-primary/20 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                 <span className="text-xl">📜</span>
                             </div>
                         </div>

                         {/* Rows 6-10 */}
                         {Array.from({ length: 20 }, (_, i) => renderSeat(i + 21))}
                     </div>
                </div>

                {/* Ezrat Nashim (Seats 41-60) */}
                <div className="mb-8 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                     <div className="flex items-center gap-2 mb-3 px-2 opacity-50">
                        <div className="h-px bg-purple-200 flex-1"></div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase">עזרת נשים</span>
                        <div className="h-px bg-purple-200 flex-1"></div>
                     </div>
                     
                     <div className="grid grid-cols-4 gap-3">
                         {Array.from({ length: 20 }, (_, i) => renderSeat(i + 41))}
                     </div>
                </div>
            </div>
        )}
      </div>

       {/* Floating Action Button (Only in List View) */}
       {viewMode === 'list' && (
           <button 
            onClick={onAddMember}
            className="absolute bottom-6 left-6 w-14 h-14 bg-primary hover:bg-blue-800 text-white rounded-full shadow-lg shadow-blue-900/30 flex items-center justify-center z-40 active:scale-95 transition-all duration-200"
           >
            <UserPlus size={24} />
          </button>
       )}

      {/* Details/Notes Modal (Read Only) */}
      {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
              <div 
                className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl p-6 animate-in slide-in-from-bottom duration-300 mb-0 pb-safe"
                onClick={(e) => e.stopPropagation()}
              >
                  <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
                  <div className="flex justify-between items-center mb-6">
                      <div>
                          <h3 className="text-xl font-bold text-slate-800">{selectedMember.name}</h3>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                             {selectedMember.seatNumber && <span className="bg-blue-50 text-primary px-2 py-0.5 rounded-full font-bold">מושב {selectedMember.seatNumber}</span>}
                             <span>{selectedMember.status || 'פעיל'}</span>
                          </div>
                      </div>
                      <button onClick={() => setSelectedMember(null)} className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200">✕</button>
                  </div>
                  <textarea 
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full h-32 border border-slate-200 rounded-xl p-4 text-slate-800 bg-slate-50 focus:bg-white resize-none mb-6"
                    placeholder="הערות..."
                  ></textarea>
                  <button onClick={handleSaveNote} className="w-full bg-primary text-white py-4 rounded-xl font-bold">שמור</button>
              </div>
          </div>
      )}

      {/* Seat Assignment Modal (Edit Mode) */}
      {seatToAssign && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300">
                 
                 <div className="p-6 border-b border-slate-100 flex-none bg-amber-50 rounded-t-3xl">
                     <div className="w-12 h-1.5 bg-slate-300/50 rounded-full mx-auto mb-6"></div>
                     <div className="flex justify-between items-center mb-4">
                         <div>
                            <h3 className="text-xl font-bold text-slate-800">שיבוץ למושב</h3>
                            <p className="text-xs text-slate-500 mt-1">בחר מתפלל לשיבוץ במושב זה</p>
                         </div>
                         <div className="flex flex-col items-center justify-center bg-white p-2 rounded-xl shadow-sm border border-amber-100">
                             <span className="text-xs text-amber-600 font-bold uppercase">מושב</span>
                             <span className="text-2xl font-black text-amber-600 leading-none">{seatToAssign}</span>
                         </div>
                     </div>

                     {/* Modal Search */}
                     <div className="relative">
                        <input 
                            type="text" 
                            value={assignSearchQuery}
                            onChange={(e) => setAssignSearchQuery(e.target.value)}
                            placeholder="חפש חבר לשיבוץ..." 
                            className="w-full bg-white border border-amber-200 rounded-xl p-3 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                            autoFocus
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                     </div>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-slate-50">
                     {membersForAssignment.length > 0 ? (
                         membersForAssignment.map(m => {
                             const isSeated = m.seatNumber !== undefined;
                             const isCurrent = m.seatNumber === seatToAssign;
                             if (isCurrent) return null; // Don't show current occupant again

                             return (
                                <button 
                                    key={m.id}
                                    onClick={() => handleAssignMember(m)}
                                    className={`w-full p-3 rounded-xl border flex items-center justify-between group transition-all duration-200 ${
                                        isSeated 
                                        ? 'bg-white border-slate-100 hover:border-amber-200 hover:bg-amber-50 opacity-90' 
                                        : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
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
                         <div className="text-center py-12 text-slate-400 text-sm">
                             לא נמצאו חברים מתאימים
                         </div>
                     )}
                 </div>
                 
                 <div className="p-4 border-t border-slate-100 flex-none pb-safe bg-white">
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