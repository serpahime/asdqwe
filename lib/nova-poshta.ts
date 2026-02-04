/**
 * Інтеграція з API Нової Пошти України
 * Документація: https://devcenter.novaposhta.ua/docs/services/556d7ccaa0feaf265c0a58c7
 */

import { logger } from './logger';

const API_URL = 'https://api.novaposhta.ua/v2.0/json/';

// API ключ можна отримати на https://devcenter.novaposhta.ua/
// Для тестування можна використовувати пустий ключ (обмежений функціонал)
const getApiKey = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: використовуємо змінну оточення
    return process.env.NEXT_PUBLIC_NOVA_POSHTA_API_KEY || '';
  }
  // Server-side
  return process.env.NEXT_PUBLIC_NOVA_POSHTA_API_KEY || '';
};

export interface NovaPoshtaCity {
  Ref: string;
  Description: string;
  DescriptionRu?: string;
  Area: string;
  AreaDescription: string;
  AreaDescriptionRu?: string;
  SettlementType: string;
  SettlementTypeDescription: string;
  SettlementTypeDescriptionRu?: string;
}

export interface NovaPoshtaWarehouse {
  Ref: string;
  SiteKey: string;
  Description: string;
  DescriptionRu?: string;
  ShortAddress: string;
  ShortAddressRu?: string;
  Phone: string;
  TypeOfWarehouse: string;
  Number: string;
  CityRef: string;
  CityDescription: string;
  CityDescriptionRu?: string;
  SettlementRef: string;
  SettlementDescription: string;
  SettlementDescriptionRu?: string;
  SettlementAreaDescription: string;
  SettlementRegionsDescription: string;
  SettlementTypeDescription: string;
  Longitude: string;
  Latitude: string;
  PostFinance: string;
  BicycleParking: string;
  PaymentAccess: string;
  POSTerminal: string;
  InternationalShipping: string;
  SelfServiceWorkplacesCount: string;
  TotalMaxWeightAllowed: string;
  PlaceMaxWeightAllowed: string;
  SendingLimitationsOnDimensions: {
    Width: number;
    Height: number;
    Length: number;
  };
  ReceivingLimitationsOnDimensions: {
    Width: number;
    Height: number;
    Length: number;
  };
  Reception: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  Delivery: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  Schedule: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
}

interface NovaPoshtaResponse<T> {
  success: boolean;
  data: T[];
  errors: any[];
  warnings: any[];
  info: any;
}

/**
 * Пошук міст за назвою
 */
export async function searchCities(
  cityName: string,
  limit: number = 20
): Promise<NovaPoshtaCity[]> {
  if (!cityName || cityName.trim().length < 1) {
    return [];
  }

  // Мінімум 2 символи для пошуку
  if (cityName.trim().length < 2) {
    return [];
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    logger.warn('nova-poshta', 'API key not configured, using fallback data', { cityName });
    // Використовуємо fallback дані для тестування
    try {
      const { searchCitiesFallback } = await import('./nova-poshta-fallback');
      const fallbackCities = searchCitiesFallback(cityName);
      if (fallbackCities.length > 0) {
        logger.info('nova-poshta', 'Using fallback cities', { count: fallbackCities.length, cityName });
        return fallbackCities;
      }
      logger.info('nova-poshta', 'No fallback cities found', { cityName });
    } catch (importError) {
      logger.warn('nova-poshta', 'Failed to import fallback data', importError as Error);
    }
    return [];
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: apiKey,
        modelName: 'Address',
        calledMethod: 'searchSettlements',
        methodProperties: {
          CityName: cityName,
          Limit: limit,
          Language: 'UA',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: {
      success: boolean;
      data: Array<{
        TotalCount: number;
        Addresses: Array<{
          Present: string;
          Warehouses: number;
          MainDescription: string;
          Area: string;
          AreaDescription: string;
          Region: string;
          RegionDescription: string;
          SettlementTypeCode: string;
          SettlementTypeDescription: string;
          Ref: string;
          DeliveryCity: string;
          DeliveryCityDescription: string;
        }>;
      }>;
      errors: any[];
      warnings: any[];
      info: any;
    } = await response.json();

    if (!result.success || result.errors.length > 0) {
      logger.warn('nova-poshta', 'API error', {
        errors: result.errors,
        cityName,
      });
      throw new Error(result.errors[0]?.message || 'API error');
    }

    // Конвертуємо відповідь в формат NovaPoshtaCity
    const cities: NovaPoshtaCity[] = [];
    if (result.data && result.data.length > 0) {
      for (const item of result.data) {
        if (item.Addresses && item.Addresses.length > 0) {
          for (const address of item.Addresses) {
            // Використовуємо MainDescription як основну назву міста
            // Present містить повну адресу, але для відображення краще використовувати MainDescription
            cities.push({
              Ref: address.Ref,
              Description: address.MainDescription || address.Present,
              Area: address.Area,
              AreaDescription: address.AreaDescription || address.RegionDescription || '',
              SettlementType: address.SettlementTypeCode,
              SettlementTypeDescription: address.SettlementTypeDescription || '',
            });
          }
        }
      }
    }

    // Видаляємо дублікати за Ref
    const uniqueCities = cities.filter((city, index, self) => 
      index === self.findIndex((c) => c.Ref === city.Ref)
    );

    logger.info('nova-poshta', 'Cities found', { 
      count: uniqueCities.length, 
      cityName,
      rawCount: cities.length 
    });
    return uniqueCities;
  } catch (error) {
    logger.error('nova-poshta', 'Failed to search cities', error as Error, { cityName });
    throw error;
  }
}

/**
 * Отримання списку відділень та поштоматів в місті
 */
export async function getWarehouses(
  cityRef: string,
  warehouseType?: 'PostOffice' | 'Postomat'
): Promise<NovaPoshtaWarehouse[]> {
  if (!cityRef) {
    return [];
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    logger.warn('nova-poshta', 'API key not configured, using fallback data', { cityRef });
    // Використовуємо fallback дані для тестування
    try {
      const { getWarehousesFallback } = await import('./nova-poshta-fallback');
      const fallbackWarehouses = getWarehousesFallback(cityRef);
      if (fallbackWarehouses.length > 0) {
        logger.info('nova-poshta', 'Using fallback warehouses', { count: fallbackWarehouses.length, cityRef });
        return fallbackWarehouses;
      }
      logger.info('nova-poshta', 'No fallback warehouses found', { cityRef });
    } catch (importError) {
      logger.warn('nova-poshta', 'Failed to import fallback data', importError as Error);
    }
    return [];
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: apiKey,
        modelName: 'Address',
        calledMethod: 'getWarehouses',
        methodProperties: {
          CityRef: cityRef,
          Language: 'UA',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: NovaPoshtaResponse<NovaPoshtaWarehouse> = await response.json();

    if (!result.success || result.errors.length > 0) {
      logger.warn('nova-poshta', 'API error', {
        errors: result.errors,
        cityRef,
      });
      throw new Error(result.errors[0]?.message || 'API error');
    }

    // Фільтруємо за типом, якщо вказано
    let warehouses = result.data || [];
    if (warehouseType) {
      warehouses = warehouses.filter((w) => {
        if (warehouseType === 'PostOffice') {
          return w.TypeOfWarehouse === '1' || w.TypeOfWarehouse === '2';
        } else {
          return w.TypeOfWarehouse === '3';
        }
      });
    }

    logger.info('nova-poshta', 'Warehouses found', {
      count: warehouses.length,
      cityRef,
      warehouseType,
    });

    return warehouses;
  } catch (error) {
    logger.error('nova-poshta', 'Failed to get warehouses', error as Error, { cityRef });
    throw error;
  }
}

/**
 * Форматування назви відділення для відображення
 */
export function formatWarehouseName(warehouse: NovaPoshtaWarehouse): string {
  const type =
    warehouse.TypeOfWarehouse === '3'
      ? 'Поштомат'
      : warehouse.TypeOfWarehouse === '2'
      ? 'Відділення'
      : 'Відділення';
  const number = warehouse.Number || '';
  const address = warehouse.ShortAddress || warehouse.Description || '';

  if (number && address) {
    return `${type} №${number} — ${address}`;
  } else if (number) {
    return `${type} №${number}`;
  } else if (address) {
    return `${type} — ${address}`;
  } else {
    return warehouse.Description || 'Відділення';
  }
}

/**
 * Debounce функція для пошуку міст
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
