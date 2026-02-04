// Client-only функции аутентификации (без зависимости от logger)
// Используется в client компонентах для избежания проблем с server/client смешением

const AUTH_STORAGE_KEY = 'juicelab_user_auth';

export interface AuthSession {
  userId: string;
  email: string;
  expiresAt: string;
}

// Проверить, авторизован ли пользователь (client-only версия без logger)
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return false;
    
    const session: AuthSession = JSON.parse(stored);
    if (new Date(session.expiresAt) < new Date()) {
      // Удаляем просроченную сессию без вызова logout (чтобы избежать зависимости от logger)
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// Client-only logout без logger
export function logoutClient(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
