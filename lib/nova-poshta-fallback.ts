/**
 * Fallback дані для тестування без API ключа
 * Використовується тільки для розробки
 */

import { NovaPoshtaCity, NovaPoshtaWarehouse } from './nova-poshta';

/**
 * Тестові міста для fallback
 */
export const FALLBACK_CITIES: NovaPoshtaCity[] = [
  {
    Ref: '8d5a980d-391c-11dd-90d9-001a92567626',
    Description: 'Київ',
    Area: '71508131-9b87-11de-822f-000c2965ae0e',
    AreaDescription: 'Київська',
    SettlementType: 'місто',
    SettlementTypeDescription: 'місто',
  },
  {
    Ref: 'db5c88d0-391c-11dd-90d9-001a92567626',
    Description: 'Львів',
    Area: '71508128-9b87-11de-822f-000c2965ae0e',
    AreaDescription: 'Львівська',
    SettlementType: 'місто',
    SettlementTypeDescription: 'місто',
  },
  {
    Ref: 'db5c88e0-391c-11dd-90d9-001a92567626',
    Description: 'Одеса',
    Area: '71508135-9b87-11de-822f-000c2965ae0e',
    AreaDescription: 'Одеська',
    SettlementType: 'місто',
    SettlementTypeDescription: 'місто',
  },
  {
    Ref: 'db5c88f0-391c-11dd-90d9-001a92567626',
    Description: 'Харків',
    Area: '71508130-9b87-11de-822f-000c2965ae0e',
    AreaDescription: 'Харківська',
    SettlementType: 'місто',
    SettlementTypeDescription: 'місто',
  },
  {
    Ref: 'db5c8900-391c-11dd-90d9-001a92567626',
    Description: 'Дніпро',
    Area: '71508127-9b87-11de-822f-000c2965ae0e',
    AreaDescription: 'Дніпропетровська',
    SettlementType: 'місто',
    SettlementTypeDescription: 'місто',
  },
];

/**
 * Тестові відділення для fallback
 */
export const FALLBACK_WAREHOUSES: Record<string, NovaPoshtaWarehouse[]> = {
  '8d5a980d-391c-11dd-90d9-001a92567626': [ // Київ
    {
      Ref: '1ec09d2e-391c-11dd-90d9-001a92567626',
      SiteKey: '12',
      Description: 'Відділення №12',
      ShortAddress: 'вул. Хрещатик, 1',
      Phone: '0 800 500 609',
      TypeOfWarehouse: '1',
      Number: '12',
      CityRef: '8d5a980d-391c-11dd-90d9-001a92567626',
      CityDescription: 'Київ',
      SettlementRef: '8d5a980d-391c-11dd-90d9-001a92567626',
      SettlementDescription: 'Київ',
      SettlementAreaDescription: 'Київська',
      SettlementRegionsDescription: 'Київська',
      SettlementTypeDescription: 'місто',
      Longitude: '30.5234',
      Latitude: '50.4501',
      PostFinance: '1',
      BicycleParking: '1',
      PaymentAccess: '1',
      POSTerminal: '1',
      InternationalShipping: '1',
      SelfServiceWorkplacesCount: '0',
      TotalMaxWeightAllowed: '0',
      PlaceMaxWeightAllowed: '0',
      SendingLimitationsOnDimensions: { Width: 0, Height: 0, Length: 0 },
      ReceivingLimitationsOnDimensions: { Width: 0, Height: 0, Length: 0 },
      Reception: { Monday: '09:00-18:00', Tuesday: '09:00-18:00', Wednesday: '09:00-18:00', Thursday: '09:00-18:00', Friday: '09:00-18:00', Saturday: '09:00-16:00', Sunday: '' },
      Delivery: { Monday: '09:00-18:00', Tuesday: '09:00-18:00', Wednesday: '09:00-18:00', Thursday: '09:00-18:00', Friday: '09:00-18:00', Saturday: '09:00-16:00', Sunday: '' },
      Schedule: { Monday: '09:00-18:00', Tuesday: '09:00-18:00', Wednesday: '09:00-18:00', Thursday: '09:00-18:00', Friday: '09:00-18:00', Saturday: '09:00-16:00', Sunday: '' },
    },
    {
      Ref: '1ec09d3e-391c-11dd-90d9-001a92567626',
      SiteKey: '25',
      Description: 'Поштомат №25',
      ShortAddress: 'просп. Перемоги, 10',
      Phone: '0 800 500 609',
      TypeOfWarehouse: '3',
      Number: '25',
      CityRef: '8d5a980d-391c-11dd-90d9-001a92567626',
      CityDescription: 'Київ',
      SettlementRef: '8d5a980d-391c-11dd-90d9-001a92567626',
      SettlementDescription: 'Київ',
      SettlementAreaDescription: 'Київська',
      SettlementRegionsDescription: 'Київська',
      SettlementTypeDescription: 'місто',
      Longitude: '30.5234',
      Latitude: '50.4501',
      PostFinance: '1',
      BicycleParking: '0',
      PaymentAccess: '1',
      POSTerminal: '1',
      InternationalShipping: '0',
      SelfServiceWorkplacesCount: '0',
      TotalMaxWeightAllowed: '0',
      PlaceMaxWeightAllowed: '0',
      SendingLimitationsOnDimensions: { Width: 0, Height: 0, Length: 0 },
      ReceivingLimitationsOnDimensions: { Width: 0, Height: 0, Length: 0 },
      Reception: { Monday: '00:00-23:59', Tuesday: '00:00-23:59', Wednesday: '00:00-23:59', Thursday: '00:00-23:59', Friday: '00:00-23:59', Saturday: '00:00-23:59', Sunday: '00:00-23:59' },
      Delivery: { Monday: '00:00-23:59', Tuesday: '00:00-23:59', Wednesday: '00:00-23:59', Thursday: '00:00-23:59', Friday: '00:00-23:59', Saturday: '00:00-23:59', Sunday: '00:00-23:59' },
      Schedule: { Monday: '00:00-23:59', Tuesday: '00:00-23:59', Wednesday: '00:00-23:59', Thursday: '00:00-23:59', Friday: '00:00-23:59', Saturday: '00:00-23:59', Sunday: '00:00-23:59' },
    },
  ],
};

/**
 * Пошук міст з fallback даними
 */
export function searchCitiesFallback(query: string): NovaPoshtaCity[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  return FALLBACK_CITIES.filter((city) =>
    city.Description.toLowerCase().includes(lowerQuery) ||
    city.AreaDescription.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Отримання відділень з fallback даними
 */
export function getWarehousesFallback(cityRef: string): NovaPoshtaWarehouse[] {
  return FALLBACK_WAREHOUSES[cityRef] || [];
}
