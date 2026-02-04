// Система пользователей и рефералов

import type { UserLevel } from '@/lib/userLevel/levels';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  city?: string; // Город пользователя
  address?: string; // Адрес пользователя
  referralCode: string; // Уникальный код пользователя
  referredBy?: string; // ID пользователя, который пригласил
  bonusBalance: number; // Бонусный баланс в грн
  createdAt: string;
  firstOrderCompleted: boolean; // Завершен ли первый заказ
  level?: UserLevel; // Уровень пользователя (серебро, золото, платина)
  // Сохраненные данные для автозаполнения
  savedDelivery?: {
    method?: 'courier' | 'post' | 'pickup';
    city?: string;
    address?: string;
  };
  savedPayment?: {
    method?: 'card' | 'cash';
  };
}

const USERS_STORAGE_KEY = 'juicelab_users';

// Генерация уникального реферального кода
function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Исключаем похожие символы
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Получить всех пользователей
export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Сохранить пользователей
function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Создать нового пользователя
export function createUser(
  email: string,
  name: string,
  phone?: string,
  referralCode?: string // Код пригласившего
): User {
  const users = getAllUsers();
  
  // Проверяем, не существует ли уже пользователь с таким email
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return existingUser;
  }

  // Проверяем реферальный код
  let referredBy: string | undefined;
  if (referralCode) {
    const referrer = users.find(u => u.referralCode === referralCode.toUpperCase());
    if (referrer && referrer.email.toLowerCase() !== email.toLowerCase()) {
      // Запрет самореферальства
      referredBy = referrer.id;
    }
  }

  const newUser: User = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    email: email.toLowerCase(),
    name,
    phone,
    referralCode: generateReferralCode(),
    referredBy,
    bonusBalance: 0,
    createdAt: new Date().toISOString(),
    firstOrderCompleted: false,
  };

  // Начисляем приветственный бонус новому пользователю
  if (referredBy) {
    newUser.bonusBalance = 10; // +10 грн приветственный бонус
  }

  users.push(newUser);
  saveUsers(users);

  // Начисляем бонус пригласившему за регистрацию друга
  if (referredBy) {
    addBonusToUser(referredBy, 10, 'Реферальная регистрация');
    
    // Проверяем достижения пригласившего
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        import('@/lib/achievements/userAchievements').then(({ checkAndUnlockAchievements }) => {
          checkAndUnlockAchievements(referredBy);
        });
      }, 100);
    }
  }

  return newUser;
}

// Получить пользователя по email
export function getUserByEmail(email: string): User | null {
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

// Получить пользователя по ID
export function getUserById(userId: string): User | null {
  const users = getAllUsers();
  return users.find(u => u.id === userId) || null;
}

// Получить пользователя по реферальному коду
export function getUserByReferralCode(code: string): User | null {
  const users = getAllUsers();
  return users.find(u => u.referralCode === code.toUpperCase()) || null;
}

// Добавить бонусы пользователю
export function addBonusToUser(
  userId: string,
  amount: number,
  reason: string
): boolean {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return false;

  user.bonusBalance += amount;
  saveUsers(users);

  // Логируем операцию
  logBonusOperation(userId, amount, 'credit', reason);
  
  return true;
}

// Списать бонусы у пользователя
export function deductBonusFromUser(
  userId: string,
  amount: number,
  reason: string
): boolean {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);
  if (!user || user.bonusBalance < amount) return false;

  user.bonusBalance -= amount;
  saveUsers(users);

  // Логируем операцию
  logBonusOperation(userId, amount, 'debit', reason);
  
  return true;
}

// Обновить пользователя
export function updateUser(userId: string, updates: Partial<User>): boolean {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return false;

  users[userIndex] = { ...users[userIndex], ...updates };
  saveUsers(users);
  return true;
}

// Отметить первый заказ как завершенный
export function markFirstOrderCompleted(userId: string): void {
  const user = getUserById(userId);
  if (!user || user.firstOrderCompleted) return;

  updateUser(userId, { firstOrderCompleted: true });

  // Если пользователь был приглашен, начисляем бонус пригласившему за первый заказ
  if (user.referredBy) {
    addBonusToUser(user.referredBy, 10, 'Первый заказ реферала');
    
    // Проверяем достижения пригласившего
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        import('@/lib/achievements/userAchievements').then(({ checkAndUnlockAchievements }) => {
          checkAndUnlockAchievements(user.referredBy!);
        });
      }, 100);
    }
  }
}

// Логирование операций с бонусами
interface BonusOperation {
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  reason: string;
  date: string;
}

const BONUS_OPERATIONS_KEY = 'juicelab_bonus_operations';

function logBonusOperation(
  userId: string,
  amount: number,
  type: 'credit' | 'debit',
  reason: string
): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(BONUS_OPERATIONS_KEY);
    const operations: BonusOperation[] = stored ? JSON.parse(stored) : [];
    
    operations.push({
      userId,
      amount,
      type,
      reason,
      date: new Date().toISOString(),
    });

    localStorage.setItem(BONUS_OPERATIONS_KEY, JSON.stringify(operations));
  } catch {
    // Игнорируем ошибки логирования
  }
}

// Получить историю операций пользователя
export function getUserBonusHistory(userId: string): BonusOperation[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(BONUS_OPERATIONS_KEY);
    if (!stored) return [];
    const operations: BonusOperation[] = JSON.parse(stored);
    return operations.filter(op => op.userId === userId);
  } catch {
    return [];
  }
}

// Получить всех рефералов пользователя
export function getUserReferrals(userId: string): User[] {
  const users = getAllUsers();
  return users.filter(u => u.referredBy === userId);
}

