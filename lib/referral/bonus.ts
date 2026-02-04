// Логика работы с бонусами

import { getUserById, deductBonusFromUser, markFirstOrderCompleted, addBonusToUser } from './users';
import { ExtendedOrder } from '@/lib/admin/orders';

// Максимальный процент от суммы заказа, который можно оплатить бонусами
const MAX_BONUS_PERCENT = 10;

// Рассчитать максимальную сумму, которую можно оплатить бонусами
export function calculateMaxBonusPayment(orderTotal: number): number {
  return Math.floor(orderTotal * MAX_BONUS_PERCENT / 100);
}

// Рассчитать итоговую сумму заказа с учетом бонусов
export function calculateOrderTotalWithBonus(
  orderTotal: number,
  bonusAmount: number
): {
  bonusUsed: number;
  finalTotal: number;
  remainingBonus: number;
} {
  const maxBonus = calculateMaxBonusPayment(orderTotal);
  const bonusUsed = Math.min(bonusAmount, maxBonus, orderTotal);
  const finalTotal = orderTotal - bonusUsed;
  const remainingBonus = bonusAmount - bonusUsed;

  return {
    bonusUsed,
    finalTotal: Math.max(0, finalTotal),
    remainingBonus,
  };
}

// Обработать заказ с использованием бонусов
export function processOrderWithBonus(
  userId: string,
  order: ExtendedOrder,
  bonusAmountToUse: number
): {
  success: boolean;
  bonusUsed: number;
  finalTotal: number;
  error?: string;
} {
  const user = getUserById(userId);
  if (!user) {
    return { success: false, bonusUsed: 0, finalTotal: order.total, error: 'Пользователь не найден' };
  }

  // Проверяем, достаточно ли бонусов
  if (user.bonusBalance < bonusAmountToUse) {
    return { success: false, bonusUsed: 0, finalTotal: order.total, error: 'Недостаточно бонусов' };
  }

  // Рассчитываем итоговую сумму
  const calculation = calculateOrderTotalWithBonus(order.total, bonusAmountToUse);
  
  // Списываем бонусы
  if (calculation.bonusUsed > 0) {
    const deducted = deductBonusFromUser(
      userId,
      calculation.bonusUsed,
      `Оплата заказа #${order.id.slice(-6)}`
    );
    
    if (!deducted) {
      return { success: false, bonusUsed: 0, finalTotal: order.total, error: 'Ошибка списания бонусов' };
    }
  }

  // Отмечаем первый заказ как завершенный (если это первый заказ)
  if (!user.firstOrderCompleted) {
    markFirstOrderCompleted(userId);
  }

  return {
    success: true,
    bonusUsed: calculation.bonusUsed,
    finalTotal: calculation.finalTotal,
  };
}

// Начислить бонусы за заказ (для реферальной системы)
export function awardReferralBonus(order: ExtendedOrder): void {
  // Эта функция вызывается после успешной оплаты заказа
  // Логика начисления уже реализована в markFirstOrderCompleted
  // Здесь можно добавить дополнительную логику, если нужно
}

// Получить реферальную ссылку пользователя
export function getReferralLink(userId: string, baseUrl: string = ''): string {
  const { getUserById } = require('./users');
  const user = getUserById(userId);
  if (!user) return '';

  const url = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${url}/register?ref=${user.referralCode}`;
}

