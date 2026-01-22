
export type ViewState = 'admin-grid' | 'admin-list' | 'add-charge' | 'add-member' | 'update-times' | 'member-view' | 'members' | 'finance' | 'settings';

export interface Member {
  id: string;
  name: string;
  avatar: string; // URL or initial
  familyStatus?: string;
  status?: string;
  family?: string;
  notes?: string; // New field for Gabbai notes
  seatNumber?: number; // Seat assignment
}

export interface Transaction {
  id: string;
  user: string;
  memberId?: string; // Optional: null for guests
  amount: number;
  type: 'Aliyah' | 'Maftir' | 'Petiha' | 'Kiddush' | 'Donation' | 'Membership' | 'Nader';
  detail?: string; // e.g. "Shlishi", "Parashat Noach"
  date: string;
  timestamp: Date;
  status: 'Paid' | 'Pending';
}

export interface PrayerTimesConfig {
  shacharit: string;
  mincha: string;
  arvit: string;
  message: string;
}

export enum ChargeType {
  ALIYAH = 'עלייה לתורה',
  MAFTIR = 'מפטיר',
  PETIHA = 'פתיחת ההיכל',
  KIDDUSH = 'קידוש',
  DONATION = 'תרומה',
  MEMBERSHIP = 'דמי חבר',
  NADER = 'נדר'
}
