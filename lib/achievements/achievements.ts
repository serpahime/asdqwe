// Система достижений

export type AchievementId = 
  | 'first_order'
  | 'five_referrals'
  | 'spent_1000'
  | 'spent_5000'
  | 'ten_orders'
  | 'vip_client'
  | 'active_referrer'
  | 'big_order'
  | 'bonus_saver';

export interface Achievement {
  id: AchievementId;
  name: {
    uk: string;
    ru: string;
  };
  description: {
    uk: string;
    ru: string;
  };
  icon: string; // Emoji или название иконки
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: {
    type: 'first_order' | 'referrals_count' | 'total_spent' | 'orders_count' | 'single_order_amount' | 'bonuses_used';
    value: number;
  };
}

// Определение всех достижений
export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  first_order: {
    id: 'first_order',
    name: {
      uk: 'Перший крок',
      ru: 'Первый шаг',
    },
    description: {
      uk: 'Оформив перше замовлення',
      ru: 'Оформил первый заказ',
    },
    icon: '🎯',
    rarity: 'common',
    condition: {
      type: 'first_order',
      value: 1,
    },
  },
  five_referrals: {
    id: 'five_referrals',
    name: {
      uk: 'Дружній',
      ru: 'Дружелюбный',
    },
    description: {
      uk: 'Привів 5 друзів',
      ru: 'Привёл 5 друзей',
    },
    icon: '👥',
    rarity: 'rare',
    condition: {
      type: 'referrals_count',
      value: 5,
    },
  },
  spent_1000: {
    id: 'spent_1000',
    name: {
      uk: 'Постійний клієнт',
      ru: 'Постоянный клиент',
    },
    description: {
      uk: 'Сума покупок >1000 грн',
      ru: 'Сумма покупок >1000 грн',
    },
    icon: '💰',
    rarity: 'rare',
    condition: {
      type: 'total_spent',
      value: 1000,
    },
  },
  spent_5000: {
    id: 'spent_5000',
    name: {
      uk: 'VIP клієнт',
      ru: 'VIP клиент',
    },
    description: {
      uk: 'Сума покупок >5000 грн',
      ru: 'Сумма покупок >5000 грн',
    },
    icon: '👑',
    rarity: 'epic',
    condition: {
      type: 'total_spent',
      value: 5000,
    },
  },
  ten_orders: {
    id: 'ten_orders',
    name: {
      uk: 'Відданий покупець',
      ru: 'Преданный покупатель',
    },
    description: {
      uk: 'Зробив 10 замовлень',
      ru: 'Сделал 10 заказов',
    },
    icon: '🛒',
    rarity: 'rare',
    condition: {
      type: 'orders_count',
      value: 10,
    },
  },
  vip_client: {
    id: 'vip_client',
    name: {
      uk: 'Легенда',
      ru: 'Легенда',
    },
    description: {
      uk: 'Привів 10+ друзів',
      ru: 'Привёл 10+ друзей',
    },
    icon: '⭐',
    rarity: 'legendary',
    condition: {
      type: 'referrals_count',
      value: 10,
    },
  },
  active_referrer: {
    id: 'active_referrer',
    name: {
      uk: 'Активний реферал',
      ru: 'Активный реферал',
    },
    description: {
      uk: 'Привів 3+ друзів',
      ru: 'Привёл 3+ друзей',
    },
    icon: '🚀',
    rarity: 'common',
    condition: {
      type: 'referrals_count',
      value: 3,
    },
  },
  big_order: {
    id: 'big_order',
    name: {
      uk: 'Великий замовлення',
      ru: 'Большой заказ',
    },
    description: {
      uk: 'Один заказ на суму >500 грн',
      ru: 'Один заказ на сумму >500 грн',
    },
    icon: '💎',
    rarity: 'rare',
    condition: {
      type: 'single_order_amount',
      value: 500,
    },
  },
  bonus_saver: {
    id: 'bonus_saver',
    name: {
      uk: 'Економний',
      ru: 'Экономный',
    },
    description: {
      uk: 'Використав бонуси на суму >100 грн',
      ru: 'Использовал бонусы на сумму >100 грн',
    },
    icon: '💸',
    rarity: 'epic',
    condition: {
      type: 'bonuses_used',
      value: 100,
    },
  },
};

// Получить все достижения
export function getAllAchievements(): Achievement[] {
  return Object.values(ACHIEVEMENTS);
}

// Получить достижение по ID
export function getAchievementById(id: AchievementId): Achievement | undefined {
  return ACHIEVEMENTS[id];
}

// Получить достижения по редкости
export function getAchievementsByRarity(rarity: Achievement['rarity']): Achievement[] {
  return Object.values(ACHIEVEMENTS).filter(a => a.rarity === rarity);
}
