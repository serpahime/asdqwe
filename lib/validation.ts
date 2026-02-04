/**
 * Утиліти для валідації форм
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Валідація email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Валідація телефону (український формат)
 */
export function validatePhone(phone: string): boolean {
  // Прибираємо всі символи крім цифр
  const cleaned = phone.replace(/\D/g, '');
  // Перевіряємо формат: +380 або 0 на початку, потім 9 цифр
  return /^(\+?38)?0\d{9}$/.test(cleaned) && cleaned.length >= 10;
}

/**
 * Форматування телефону
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('380')) {
    return `+38 (0${cleaned.slice(3, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
  }
  if (cleaned.startsWith('0')) {
    return `+38 (${cleaned.slice(1, 2)}) ${cleaned.slice(2, 5)}-${cleaned.slice(5, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Валідація імені
 */
export function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 50;
}

/**
 * Валідація адреси
 */
export function validateAddress(address: string): boolean {
  return address.trim().length >= 5 && address.trim().length <= 200;
}

/**
 * Валідація міста
 */
export function validateCity(city: string): boolean {
  return city.trim().length >= 2 && city.trim().length <= 50;
}

/**
 * Валідація даних оформлення замовлення
 */
export function validateCheckoutForm(data: {
  name: string;
  email: string;
  phone: string;
  deliveryMethod: 'courier' | 'post' | 'pickup';
  address?: string;
  city?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // Валідація імені
  if (!data.name || !validateName(data.name)) {
    errors.name = 'Ім\'я повинно містити від 2 до 50 символів';
  }

  // Валідація email
  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Введіть коректний email адрес';
  }

  // Валідація телефону
  if (!data.phone || !validatePhone(data.phone)) {
    errors.phone = 'Введіть коректний номер телефону (наприклад: +38 (050) 123-45-67)';
  }

  // Валідація адреси та міста (якщо не самовивіз)
  if (data.deliveryMethod !== 'pickup') {
    if (!data.city || !validateCity(data.city)) {
      errors.city = 'Введіть коректну назву міста';
    }
    if (!data.address || !validateAddress(data.address)) {
      errors.address = 'Введіть коректну адресу доставки (мінімум 5 символів)';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
