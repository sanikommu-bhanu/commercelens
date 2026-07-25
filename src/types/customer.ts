export type Segment = 'VIP' | 'Repeat' | 'One-time' | 'At-risk';

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  email: string;
  segment: Segment;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
  ltv: number;
}
