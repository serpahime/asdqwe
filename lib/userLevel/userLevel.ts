// Управление уровнями пользователей

import { getUserById, updateUser } from '@/lib/referral/users';
import { getAllOrders } from '@/lib/admin/orders';
import { getAllUsers } from '@/lib/referral/users';
import {
  calculateUserPoints,
  getUserLevel,
  getLevelInfo,
  getLevelProgress,
  type UserLevel,
  type UserPoints,
} from './levels';

// Получить баллы и уровень пользователя
export function getUserLevelData(userId: string): {
  points: UserPoints;
  level: UserLevel;
  levelInfo: ReturnType<typeof getLevelInfo>;
  progress: ReturnType<typeof getLevelProgress>;
} {
  const user = getUserById(userId);
  if (!user) {
    return {
      points: { ordersPoints: 0, spendingPoints: 0, referralsPoints: 0, totalPoints: 0 },
      level: 'silver',
      levelInfo: getLevelInfo('silver'),
      progress: { current: 0, next: 0, percentage: 0, nextLevel: null },
    };
  }

  // Получаем статистику пользователя
  const allOrders = getAllOrders();
  const userOrders = allOrders.filter(
    (order) =>
      order.customer.userId === userId &&
      (order.status === 'completed' || order.status === 'delivered')
  );

  const ordersCount = userOrders.length;
  const totalSpent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0);

  const allUsers = getAllUsers();
  const referralsCount = allUsers.filter((u) => u.referredBy === userId).length;

  // Вычисляем баллы
  const points = calculateUserPoints(ordersCount, totalSpent, referralsCount);

  // Определяем уровень
  const level = getUserLevel(points.totalPoints);

  // Получаем информацию об уровне
  const levelInfo = getLevelInfo(level);

  // Получаем прогресс
  const progress = getLevelProgress(points.totalPoints, level);

  // Обновляем уровень пользователя, если он изменился
  if (user.level !== level) {
    updateUser(userId, { level });
  }

  return {
    points,
    level,
    levelInfo,
    progress,
  };
}

// Получить только уровень пользователя (быстрая проверка)
export function getUserLevelOnly(userId: string): UserLevel {
  const user = getUserById(userId);
  if (!user) return 'silver';

  const allOrders = getAllOrders();
  const userOrders = allOrders.filter(
    (order) =>
      order.customer.userId === userId &&
      (order.status === 'completed' || order.status === 'delivered')
  );

  const ordersCount = userOrders.length;
  const totalSpent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0);

  const allUsers = getAllUsers();
  const referralsCount = allUsers.filter((u) => u.referredBy === userId).length;

  const points = calculateUserPoints(ordersCount, totalSpent, referralsCount);
  return getUserLevel(points.totalPoints);
}
