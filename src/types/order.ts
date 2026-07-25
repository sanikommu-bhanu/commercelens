export type OrderStatus = 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled';
export type FunnelStage = 'visit' | 'view' | 'cart' | 'checkout' | 'purchase';

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  size: string;
  color: string;
  image: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  funnelStage: FunnelStage;
  date: string;
}

export interface FunnelDay {
  date: string;
  visitors: number;
  views: number;
  addToCart: number;
  checkout: number;
  purchase: number;
}
