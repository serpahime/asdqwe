export interface ProductVariant {
  volume?: string; // '2 мл' | '3 мл'
  resistance?: string; // '0,4 Ом' | '0,6 Ом' | '0,8 Ом' | '1,0 Ом' | '1,2 Ом' | '0,4 Ом 3мл (top fill)' | '0,6 Ом 3мл (top fill)' | '0,8 Ом 3мл (top fill)'
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  fullDescription: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: 'fruits' | 'mint' | 'dessert' | 'mix';
  strength: 'light' | 'medium' | 'strong';
  isNew?: boolean;
  isHit?: boolean;
  composition: string[];
  instructions: string;
  rating: number;
  reviewsCount: number;
  variants?: {
    volumes?: string[];
    resistances?: string[];
  };
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  bonusUsed?: number; // Использовано бонусов
  finalTotal?: number; // Итоговая сумма после применения бонусов
  customer: {
    name: string;
    email: string;
    phone: string;
    userId?: string; // ID пользователя, если авторизован
  };
  delivery: {
    method: 'courier' | 'post' | 'pickup';
    address?: string;
    city?: string;
  };
  payment: {
    method: 'card' | 'cash';
    transactionId?: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'new' | 'processing' | 'completed' | 'cancelled' | 'returned';
  createdAt: string;
  // Юридичні дані для захисту продавця
  legal?: {
    // Підтвердження згоди з умовами
    termsAccepted: boolean;
    termsAcceptedAt: string;
    privacyAccepted: boolean;
    privacyAcceptedAt: string;
    disclaimerAccepted: boolean;
    disclaimerAcceptedAt: string;
    // Технічні дані для захисту від шахрайства
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    fingerprint?: string;
    // Підтвердження віку
    ageConfirmed: boolean;
    ageConfirmedAt?: string;
    // Попередження про повернення
    returnPolicyAcknowledged: boolean;
    returnPolicyAcknowledgedAt: string;
    // Попередження про чарджбеки
    chargebackWarningAcknowledged: boolean;
    chargebackWarningAcknowledgedAt: string;
  };
}



