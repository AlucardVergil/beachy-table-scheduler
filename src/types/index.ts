
export interface Reservation {
  _id?: string;
  tableId: number;
  date: Date;
  timeSlot?: 'lunch' | 'dinner' | null; // null for beach tables
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'not_required';
  type: 'beach' | 'restaurant';
}

export interface Admin {
  _id?: string;
  username: string;
  password: string;
}

export interface Table {
  id: number;
  seats: number;
  x: number;
  y: number;
  type: 'beach' | 'restaurant';
  isAvailable: boolean;
}

export const RESTAURANT_TIME_SLOTS = {
  lunch: '12:00-18:00',
  dinner: '18:00-23:00'
} as const;
