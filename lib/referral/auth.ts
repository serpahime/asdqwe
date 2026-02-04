// Система аутентификации пользователей

import { createUser, getUserByEmail, getUserById, type User } from './users';
import { logger } from '@/lib/logger';

const AUTH_STORAGE_KEY = 'juicelab_user_auth';

export interface AuthSession {
  userId: string;
  email: string;
  expiresAt: string;
}

// Регистрация нового пользователя
export function register(
  email: string,
  name: string,
  password: string,
  phone?: string,
  referralCode?: string
): { success: boolean; user?: User; error?: string } {
  try {
    logger.debug('auth', 'Registration attempt', { email, hasReferralCode: !!referralCode });
    
    // Проверяем, не существует ли уже пользователь
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      logger.logAuth('register_failed', { email, reason: 'User already exists' });
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }

    // В реальном приложении здесь должно быть хеширование пароля
    // Пока просто сохраняем (НЕ для продакшена!)
    const user = createUser(email, name, phone, referralCode);
    
    // Сохраняем пароль (в продакшене - только хеш!)
    if (typeof window !== 'undefined') {
      const passwords = JSON.parse(localStorage.getItem('juicelab_passwords') || '{}');
      passwords[user.id] = password; // В продакшене - хеш!
      localStorage.setItem('juicelab_passwords', JSON.stringify(passwords));
    }

    logger.logAuth('register_success', { userId: user.id, email, referralCode });

    // Автоматически входим после регистрации
    login(email, password);

    return { success: true, user };
  } catch (error) {
    logger.error('auth', 'Registration error', error as Error, { email });
    return { success: false, error: 'Ошибка регистрации' };
  }
}

// Вход
export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  try {
    logger.debug('auth', 'Login attempt', { email });
    
    const user = getUserByEmail(email);
    if (!user) {
      logger.logAuth('login_failed', { email, reason: 'User not found' });
      logger.logSecurity('failed_login', { email, reason: 'Invalid credentials' });
      return { success: false, error: 'Неверный email или пароль' };
    }

    // Проверяем пароль (в продакшене - проверка хеша!)
    if (typeof window !== 'undefined') {
      const passwords = JSON.parse(localStorage.getItem('juicelab_passwords') || '{}');
      if (passwords[user.id] !== password) {
        logger.logAuth('login_failed', { email, userId: user.id, reason: 'Invalid password' });
        logger.logSecurity('failed_login', { email, userId: user.id, reason: 'Invalid password' });
        return { success: false, error: 'Неверный email или пароль' };
      }
    }

    // Создаем сессию
    const session: AuthSession = {
      userId: user.id,
      email: user.email,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 дней
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    }

    logger.logAuth('login_success', { userId: user.id, email });
    return { success: true, user };
  } catch (error) {
    logger.error('auth', 'Login error', error as Error, { email });
    return { success: false, error: 'Ошибка входа' };
  }
}

// Выход
export function logout(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const session = localStorage.getItem(AUTH_STORAGE_KEY);
    if (session) {
      const parsedSession: AuthSession = JSON.parse(session);
      logger.logAuth('logout', { userId: parsedSession.userId, email: parsedSession.email });
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    logger.error('auth', 'Logout error', error as Error);
  }
}

// Проверить, авторизован ли пользователь
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return false;
    
    const session: AuthSession = JSON.parse(stored);
    if (new Date(session.expiresAt) < new Date()) {
      logout();
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// Получить текущего пользователя
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    
    const session: AuthSession = JSON.parse(stored);
    if (new Date(session.expiresAt) < new Date()) {
      logout();
      return null;
    }

    return getUserById(session.userId);
  } catch {
    return null;
  }
}

