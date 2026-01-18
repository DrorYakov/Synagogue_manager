import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { AdminDashboardGrid } from './components/AdminDashboardGrid';
import { AdminDashboardList } from './components/AdminDashboardList';
import { AddChargeFlow } from './components/AddChargeFlow';
import { AddMemberForm } from './components/AddMemberForm';
import { UpdateTimesView } from './components/UpdateTimesView';
import { MemberDebtView } from './components/MemberDebtView';
import { MembersView } from './components/MembersView';
import { FinanceView } from './components/FinanceView';
import { SettingsView } from './components/SettingsView';
import { ViewState, Transaction, Member, PrayerTimesConfig } from './types';

const INITIAL_TRANSACTIONS: Transaction[] = [
    { id: '1', user: 'יצחק לוי', type: 'Maftir', detail: 'פרשת נח', amount: 360, date: 'שבת האחרונה', timestamp: new Date(), status: 'Pending' },
    { id: '2', user: 'אברהם כהן', type: 'Aliyah', detail: 'שלישי', amount: 180, date: 'שבת האחרונה', timestamp: new Date(), status: 'Paid' },
    { id: '3', user: 'משה מזרחי', type: 'Kiddush', detail: 'חסות לקידוש', amount: 1200, date: 'יום שישי', timestamp: new Date(), status: 'Pending' },
    { id: '4', user: 'דוד שרעבי', type: 'Petiha', detail: 'תפילת שחרית', amount: 100, date: 'היום בבוקר', timestamp: new Date(), status: 'Pending' },
    { id: '5', user: 'יוסף אזולאי', type: 'Nader', detail: 'לרפואת אשתו', amount: 52, date: 'אתמול', timestamp: new Date(), status: 'Paid' },
];

const INITIAL_MEMBERS: Member[] = [
    { id: '1', name: 'אברהם כהן', status: 'פעיל', family: 'כהן', avatar: 'א', notes: 'צריך יזכור בשבוע הבא' },
    { id: '2', name: 'יצחק לוי', status: 'פעיל', family: 'לוי', avatar: 'י' },
    { id: '3', name: 'משה מזרחי', status: 'חבר ועד', family: 'מזרחי', avatar: 'מ' },
    { id: '4', name: 'דוד שרעבי', status: 'פעיל', family: 'שרעבי', avatar: 'ד' },
    { id: '5', name: 'יעקב פרידמן', status: 'אורח', family: 'פרידמן', avatar: 'י' },
    { id: '6', name: 'יוסף אזולאי', status: 'פעיל', family: 'אזולאי', avatar: 'י' },
    { id: '7', name: 'חיים בוזגלו', status: 'לא פעיל', family: 'בוזגלו', avatar: 'ח' },
];

const INITIAL_PRAYER_TIMES: PrayerTimesConfig = {
    shacharit: '06:15',
    mincha: '16:45',
    arvit: '17:30',
    message: 'שבת פרשת נח: הקידוש בחסות משפחת מזרחי לרגל הולדת הנכד. מזל טוב!'
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('admin-grid');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesConfig>(INITIAL_PRAYER_TIMES);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [highlightMemberId, setHighlightMemberId] = useState<string | null>(null);

  const handleNavigate = (view: string) => {
      setCurrentView(view as ViewState);
      // Reset temporary states on nav
      setShowSuccessBanner(false); 
      setHighlightMemberId(null);
  }

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    setShowSuccessBanner(true);
    setCurrentView('admin-list');
    setTimeout(() => setShowSuccessBanner(false), 5000);
  };

  const handleToggleTransactionStatus = (id: string) => {
      setTransactions(prev => prev.map(t => {
          if (t.id === id) {
              return { ...t, status: t.status === 'Paid' ? 'Pending' : 'Paid' };
          }
          return t;
      }));
  };

  const handleUpdateMember = (updatedMember: Member) => {
      setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  const handleAddMember = (memberData: { name: string }) => {
      const parts = memberData.name.split(' ');
      const family = parts.length > 1 ? parts[parts.length - 1] : '';
      
      const newMember: Member = {
          id: Date.now().toString(),
          name: memberData.name,
          status: 'פעיל',
          family: family,
          avatar: memberData.name.charAt(0)
      };

      setMembers(prev => [newMember, ...prev]);
      setHighlightMemberId(newMember.id);
      setCurrentView('members');
      
      // Clear highlight after 3 seconds
      setTimeout(() => setHighlightMemberId(null), 3000);
  };

  const handleUpdateTimes = (newTimes: PrayerTimesConfig) => {
      setPrayerTimes(newTimes);
      setCurrentView('admin-grid');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'admin-grid':
        return <AdminDashboardGrid onNavigate={handleNavigate} message={prayerTimes.message} />;
      case 'admin-list':
        return (
            <AdminDashboardList 
                onAddCharge={() => setCurrentView('add-charge')} 
                transactions={transactions} 
                showSuccessBanner={showSuccessBanner}
                onToggleStatus={handleToggleTransactionStatus}
            />
        );
      case 'add-charge':
        return <AddChargeFlow onComplete={handleAddTransaction} onCancel={() => setCurrentView('admin-grid')} existingMembers={members} />;
      case 'add-member':
        return <AddMemberForm onSave={handleAddMember} onCancel={() => setCurrentView('members')} existingMembers={members} />;
      case 'update-times':
        return <UpdateTimesView initialData={prayerTimes} onSave={handleUpdateTimes} onCancel={() => setCurrentView('admin-grid')} />;
      case 'member-view':
        return <MemberDebtView prayerTimes={prayerTimes} />;
      
      // Tabs
      case 'members':
        return (
            <MembersView 
                members={members} 
                highlightId={highlightMemberId} 
                onAddMember={() => setCurrentView('add-member')}
                onUpdateMember={handleUpdateMember}
            />
        );
      case 'finance':
        return <FinanceView />;
      case 'settings':
        return <SettingsView />;
        
      default:
        return <AdminDashboardGrid onNavigate={handleNavigate} message={prayerTimes.message} />;
    }
  };

  // Custom Header Title based on view
  const getHeaderTitle = () => {
      switch(currentView) {
          case 'admin-grid': return 'ניהול בית כנסת';
          case 'admin-list': return 'גבייה ונדרים';
          case 'add-charge': return 'חיוב מתפלל';
          case 'add-member': return 'הוספת חבר';
          case 'update-times': return 'עדכון זמנים';
          case 'member-view': return 'ההתראות שלי';
          case 'members': return 'ספר החברים';
          case 'finance': return 'קופה ודוחות';
          case 'settings': return 'הגדרות';
          default: return 'ניהול בית כנסת';
      }
  };

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={handleNavigate}
      title={getHeaderTitle()}
    >
      {renderContent()}
    </Layout>
  );
}