export type CategoryType = 'spices' | 'fashion' | 'accessories' | 'drinks';

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  price: number;
  image: string;
  stock: number;
  attributes: {
    origin?: string; // e.g. "Matale District", "Kandy Highlands"
    grade?: string; // e.g. "Alba Grade Cinnamon", "Organic Grade-A"
    sizes?: string[]; // e.g. ["S", "M", "L", "XL"]
    material?: string; // e.g. "Pure Linen", "Coconut Shell", "Handmade Brass"
    ingredients?: string[]; // e.g. ["Gotu Kola", "Wild Honey", "Fresh King Coconut"]
    servingTemp?: string; // e.g. "Chilled", "Room Temp"
  };
}

export interface Inquiry {
  id: string;
  productId?: string;
  productName?: string;
  productCategory?: CategoryType;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface BusinessAnalytics {
  totalInquiries: number;
  pendingInquiries: number;
  divisionShares: Record<CategoryType, number>;
  totalProductsCount: number;
  recentActivity: string[];
}
