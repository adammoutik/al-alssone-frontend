export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  category?: string;
  niveau?: string;
}

export interface Family {
  _id: string;
  familyName: string;
}

export interface Payment {
  _id: string;
  studentId: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'failed';
}

export interface Notification {
  _id: string;
  subject: string;
  message: string;
  status?: 'paid' | 'overdue' | 'failed';
  read: boolean;
  createdAt: string;
  scheduledFor?: string;
  errorMessage?: string;
  paymentId?: Payment;
  familyId?: Family;
} 