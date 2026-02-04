// Управление достижениями пользователей

import { AchievementId, ACHIEVEMENTS } from './achievements';
import { getAllUsers, getUserById, updateUser } from '@/lib/referral/users';
import { getAllOrders } from '@/lib/admin/orders';

const USER_ACHIEVEMENTS_STORAGE_KEY = 'juicelab_user_achievements';

export interface UserAchievement {
  achievementId: AchievementId;
  unlockedAt: string;
  progress?: number; // Текущий прогресс (для прогрессивных достижений)
}

export interface UserAchievementsData {
  userId: string;
  achievements: UserAchievement[];
  lastChecked: string; // Дата последней проверки достижений
}

// Получить достижения пользователя
export function getUserAchievements(userId: string): UserAchievement[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(USER_ACHIEVEMENTS_STORAGE_KEY);
    if (!stored) return [];
    const data: UserAchievementsData[] = JSON.parse(stored);
    const userData = data.find(d => d.userId === userId);
    return userData?.achievements || [];
  } catch {
    return [];
  }
}

// Сохранить достижения пользователя
function saveUserAchievements(userId: string, achievements: UserAchievement[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(USER_ACHIEVEMENTS_STORAGE_KEY);
    const data: UserAchievementsData[] = stored ? JSON.parse(stored) : [];
    const existingIndex = data.findIndex(d => d.userId === userId);
    
    const userData: UserAchievementsData = {
      userId,
      achievements,
      lastChecked: new Date().toISOString(),
    };
    
    if (existingIndex >= 0) {
      data[existingIndex] = userData;
    } else {
      data.push(userData);
    }
    
    localStorage.setItem(USER_ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Игнорируем ошибки
  }
}

// Проверить, разблокировано ли достижение
export function hasAchievement(userId: string, achievementId: AchievementId): boolean {
  const achievements = getUserAchievements(userId);
  return achievements.some(a => a.achievementId === achievementId);
}

// Разблокировать достижение
export function unlockAchievement(userId: string, achievementId: AchievementId): boolean {
  if (hasAchievement(userId, achievementId)) {
    return false; // Уже разблокировано
  }
  
  const achievements = getUserAchievements(userId);
  achievements.push({
    achievementId,
    unlockedAt: new Date().toISOString(),
  });
  
  saveUserAchievements(userId, achievements);
  return true;
}

// Получить статистику пользователя для проверки достижений
export interface UserStats {
  firstOrderCompleted: boolean;
  referralsCount: number;
  totalSpent: number;
  ordersCount: number;
  maxSingleOrderAmount: number; // Максимальная сумма одного заказа
  totalBonusesUsed: number; // Общая сумма использованных бонусов
}

export function getUserStats(userId: string): UserStats {
  const user = getUserById(userId);
  if (!user) {
    return {
      firstOrderCompleted: false,
      referralsCount: 0,
      totalSpent: 0,
      ordersCount: 0,
      maxSingleOrderAmount: 0,
      totalBonusesUsed: 0,
    };
  }
  
  // Получаем заказы пользователя
  const allOrders = getAllOrders();
  const userOrders = allOrders.filter(order => 
    order.customer.userId === userId && 
    order.status === 'completed'
  );
  
  const totalSpent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  
  // Находим максимальную сумму одного заказа
  const maxSingleOrderAmount = userOrders.length > 0
    ? Math.max(...userOrders.map(order => order.total || 0))
    : 0;
  
  // Вычисляем общую сумму использованных бонусов
  const totalBonusesUsed = userOrders.reduce((sum, order) => sum + (order.bonusUsed || 0), 0);
  
  // Получаем количество рефералов
  const allUsers = getAllUsers();
  const referralsCount = allUsers.filter(u => u.referredBy === userId).length;
  
  return {
    firstOrderCompleted: user.firstOrderCompleted,
    referralsCount,
    totalSpent,
    ordersCount: userOrders.length,
    maxSingleOrderAmount,
    totalBonusesUsed,
  };
}

// Проверить и разблокировать достижения пользователя
export function checkAndUnlockAchievements(userId: string): AchievementId[] {
  const stats = getUserStats(userId);
  const unlocked: AchievementId[] = [];
  
  // Проверяем каждое достижение
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    if (hasAchievement(userId, achievement.id)) {
      return; // Уже разблокировано
    }
    
    let shouldUnlock = false;
    
    switch (achievement.condition.type) {
      case 'first_order':
        shouldUnlock = stats.firstOrderCompleted;
        break;
      case 'referrals_count':
        shouldUnlock = stats.referralsCount >= achievement.condition.value;
        break;
      case 'total_spent':
        shouldUnlock = stats.totalSpent >= achievement.condition.value;
        break;
      case 'orders_count':
        shouldUnlock = stats.ordersCount >= achievement.condition.value;
        break;
      case 'single_order_amount':
        shouldUnlock = stats.maxSingleOrderAmount >= achievement.condition.value;
        break;
      case 'bonuses_used':
        shouldUnlock = stats.totalBonusesUsed >= achievement.condition.value;
        break;
    }
    
    if (shouldUnlock) {
      unlockAchievement(userId, achievement.id);
      unlocked.push(achievement.id);
    }
  });
  
  return unlocked;
}

// Получить прогресс для достижения (для отображения прогресс-бара)
export function getAchievementProgress(userId: string, achievementId: AchievementId): {
  current: number;
  target: number;
  percentage: number;
} {
  const achievement = ACHIEVEMENTS[achievementId];
  if (!achievement) {
    return { current: 0, target: 0, percentage: 0 };
  }
  
  const stats = getUserStats(userId);
  let current = 0;
  
  switch (achievement.condition.type) {
    case 'first_order':
      current = stats.firstOrderCompleted ? 1 : 0;
      break;
    case 'referrals_count':
      current = stats.referralsCount;
      break;
    case 'total_spent':
      current = stats.totalSpent;
      break;
    case 'orders_count':
      current = stats.ordersCount;
      break;
    case 'single_order_amount':
      current = stats.maxSingleOrderAmount;
      break;
    case 'bonuses_used':
      current = stats.totalBonusesUsed;
      break;
  }
  
  const target = achievement.condition.value;
  
  // Вычисляем процент выполнения
  const percentage = Math.min(100, Math.round((current / target) * 100));
  
  return { current, target, percentage };
}
