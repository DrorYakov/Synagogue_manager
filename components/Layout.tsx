import React from 'react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  title?: string;
  floatingControls?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onChangeView, 
  title = "ניהול בית כנסת",
  floatingControls
}) => {
  const navItems: { id: string; label: string; icon: string; targetView: ViewState }[] = [
    { id: 'home', label: 'בית', icon: '🏠', targetView: 'admin-grid' },
    { id: 'members', label: 'מתפללים', icon: '👥', targetView: 'members' },
    { id: 'finance', label: 'כספים', icon: '💰', targetView: 'finance' },
    { id: 'settings', label: 'הגדרות', icon: '⚙️', targetView: 'settings' },
  ];

  const isTabActive = (itemId: string) => {
    if (itemId === 'home') {
      return ['admin-grid', 'admin-list', 'add-charge', 'update-times'].includes(currentView);
    }
    return currentView === itemId;
  };

  return (
    <div className="flex flex-col h-screen sm:h-[800px] w-full max-w-md mx-auto bg-paper-bg sm:rounded-3xl overflow-hidden relative font-sans shadow-intense border border-slate-200" dir="rtl">
      {/* Header */}
      <header className="flex-none bg-primary text-white p-5 flex items-center justify-between z-[100] shadow-medium relative">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gold font-bold text-sm shadow-inner">
            SM
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">{title}</h1>
            <p className="text-[10px] text-blue-200 opacity-80">מערכת ניהול מתקדמת</p>
          </div>
        </div>
      </header>

      {floatingControls && (
        <div className="absolute top-[5rem] left-4 z-30 flex flex-col items-end pointer-events-none">
           <div className="pointer-events-auto">
             {floatingControls}
           </div>
        </div>
      )}

      <main className="flex-1 flex flex-col bg-paper-bg p-0 relative z-10 overflow-hidden">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-none bg-surface border-t border-slate-200 z-[100] pb-safe shadow-[0_-8px_20px_-5px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center h-20 pb-2">
          {navItems.map((item) => {
             const active = isTabActive(item.id);
             return (
              <button 
                key={item.label}
                onClick={() => onChangeView(item.targetView)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative group`}
              >
                {active && (
                   <div className="absolute top-0 w-8 h-1 bg-gold rounded-b-full shadow-[0_2px_8px_rgba(217,119,6,0.5)]"></div>
                )}
                
                <div className={`text-xl transition-transform duration-300 ${active ? 'scale-110 -translate-y-1' : 'grayscale opacity-60 group-hover:opacity-100 group-hover:scale-105'}`}>
                    {item.icon}
                </div>
                <span className={`text-[10px] font-medium tracking-wide transition-colors ${active ? 'text-primary font-bold' : 'text-slate-400'}`}>
                    {item.label}
                </span>
              </button>
             );
          })}
        </div>
      </nav>
    </div>
  );
};