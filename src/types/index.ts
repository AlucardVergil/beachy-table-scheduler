
export interface Reservation {
  _id?: string;
  tableId: number;
  date: Date;
  arrivalTime: string;
  departureTime: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'cancelled';
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
  isAvailable: boolean;
  availableHours: string[];
}
