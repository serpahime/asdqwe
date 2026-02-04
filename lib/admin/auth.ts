// Простая система аутентификации для админ-панели
// В продакшене должна быть заменена на полноценную систему с JWT и backend

const ADMIN_STORAGE_KEY = 'juicelab_admin_auth';
const ADMIN_CREDENTIALS = {
  email: 'admin@juicelub.store',
  password: 'admin123', // В продакшене должен быть хеш
};

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin' | 'manager';
  lastLogin?: string;
}

// Проверить авторизацию
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const auth = localStorage.getItem(ADMIN_STORAGE_KEY);
  return !!auth;
}

// Войти
export function login(email: string, password: string): boolean {
  if (typeof window === 'undefined') return false;
  
  // Нормализация данных (trim и lowercase для email)
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  
  if (
    normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase() &&
    normalizedPassword === ADMIN_CREDENTIALS.password
  ) {
    const admin: AdminUser = {
      email: ADMIN_CREDENTIALS.email,
      name: 'Администратор',
      role: 'admin',
      lastLogin: new Date().toISOString(),
    };
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
    return true;
  }
  return false;
}

// Выйти
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_STORAGE_KEY);
}

// Получить текущего пользователя
export function getCurrentUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

