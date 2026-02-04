import { Product, Review } from '@/types';

// CHASER вкусы
const chaserFlavors = [
  { name: 'CHASER 30 ml | 65 мг | Виноград', slug: 'chaser-vinograd' },
  { name: 'CHASER 30 ml | 65 мг | Голубая малина', slug: 'chaser-golubaya-malina' },
  { name: 'CHASER 30 ml | 65 мг | Ягоды', slug: 'chaser-yagody' },
  { name: 'CHASER 30 ml | 65 мг | Чёрная смородина', slug: 'chaser-chernaya-smorodina' },
  { name: 'CHASER 30 ml | 65 мг | Черешня', slug: 'chaser-chereshnya' },
  { name: 'CHASER 30 ml | 65 мг | Кислое яблоко', slug: 'chaser-kisloe-yabloko' },
  { name: 'CHASER 30 ml | 65 мг | Персик', slug: 'chaser-persik' },
  { name: 'CHASER 30 ml | 65 мг | Классическая мята', slug: 'chaser-klassicheskaya-myata' },
  { name: 'CHASER 30 ml | 65 мг | Сладкая мята', slug: 'chaser-sladkaya-myata' },
  { name: 'CHASER 30 ml | 65 мг | Мятная жвачка', slug: 'chaser-myatnaya-zhvachka' },
  { name: 'CHASER 30 ml | 65 мг | Ментол-черника', slug: 'chaser-mentol-chernika' },
  { name: 'CHASER 30 ml | 65 мг | Смородина-ментол', slug: 'chaser-smorodina-mentol' },
];

export const products: Product[] = [
  // CHASER продукты
  ...chaserFlavors.map((flavor, index) => {
    const isBerry = flavor.name.includes('Виноград') || flavor.name.includes('Голубая малина') || 
                   flavor.name.includes('Ягоды') || flavor.name.includes('Чёрная смородина') || 
                   flavor.name.includes('Черешня') || flavor.name.includes('Кислое яблоко') || 
                   flavor.name.includes('Персик');
    const category = isBerry ? 'fruits' : 'mint';
    
    return {
      id: `chaser-${index + 1}`,
      name: flavor.name,
      slug: flavor.slug,
      description: `Набор CHASER 30 ml с крепостью 65 мг в оригинальном вкусе ${flavor.name.split('|')[2]?.trim()}`,
      fullDescription: `🍭 CHASER 30 ml | 65 мг | Original - готовый набор для идеального опыта. В состав набора входит: ароматизатор (12 мл), глицерин (15 мл) и бустер 3 мл с крепостью 50/65 мг. Вкус: ${flavor.name.split('|')[2]?.trim()}`,
      price: 289,
      images: [
        '/chaser.png',
      ],
      category: category as 'fruits' | 'mint',
      strength: 'medium' as const,
      isHit: index < 3,
      isNew: index >= 3 && index < 6,
      composition: [
        'Ароматизатор — 12 мл',
        'Глицерин — 15 мл',
        'Бустер — 3 мл (50 / 65 мг)',
      ],
      instructions: 'Перед использованием хорошо взболтайте. Смешайте все компоненты набора. После первого заправления дайте 15 минут для пропитки картриджа. Не заполняйте более чем на 2/3 объёма, чтобы избежать протечек.',
      rating: parseFloat((4.7 + (index % 10) * 0.02).toFixed(1)),
      reviewsCount: 50 + (index % 7) * 15,
    } as Product;
  }),

  // Vaporesso XROS картриджи
  {
    id: 'xros-corex-20',
    name: 'Vaporesso XROS COREX 2.0',
    slug: 'vaporesso-xros-corex-20',
    description: 'Оновлена технологія COREX 2.0 — максимально чистий смак та стабільна робота',
    fullDescription: '💨 Vaporesso XROS COREX 2.0 — нове покоління картриджів з оновленою технологією COREX 2.0. Забезпечує максимально чистий смак та стабільну роботу. Повна сумісність з усією лінійкою XROS.',
    price: 139,
    images: [
      '/chaser.png',
    ],
    category: 'mix' as const,
    strength: 'medium' as const,
    isNew: true,
    isHit: true,
    composition: [
      'Технологія COREX 2.0',
      'Сумісність: лінійка XROS',
    ],
    instructions: 'Після першого заправлення дайте картриджу 15 хв, щоб він добре просякнувся. Не заливайте більше ніж 2/3 об\'єму, щоб уникнути протікань. Під час заряджання пристрою краще знімати картридж — так він прослужить довше.',
    rating: 4.8,
    reviewsCount: 234,
    variants: {
      volumes: ['2 мл', '3 мл'],
      resistances: [
        '0,4 Ом',
        '0,6 Ом',
        '0,8 Ом',
        '1,0 Ом',
        '1,2 Ом',
        '0,4 Ом 3мл (top fill)',
        '0,6 Ом 3мл (top fill)',
        '0,8 Ом 3мл (top fill)',
      ],
    },
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    productId: 'chaser-1',
    author: 'Алексей М.',
    rating: 5,
    text: 'Отличный набор CHASER! Вкус винограда очень насыщенный. Рекомендую!',
    date: '2024-01-15',
  },
  {
    id: '2',
    productId: 'chaser-2',
    author: 'Мария К.',
    rating: 5,
    text: 'Покупаю уже третий раз. Качество на высоте, вкус голубой малины просто потрясающий.',
    date: '2024-01-10',
  },
  {
    id: '3',
    productId: 'xros-corex-20',
    author: 'Дмитрий С.',
    rating: 5,
    text: 'Vaporesso XROS COREX 2.0 - отличные картриджи! Чистый вкус и стабильная работа. Идеально.',
    date: '2024-01-20',
  },
];

export const categoryNames = {
  fruits: 'Ягодные',
  mint: 'Ментол / освежающие',
  dessert: 'Десерт',
  mix: 'Аксессуары',
};

export const strengthNames = {
  light: 'Лёгкий',
  medium: 'Средний',
  strong: 'Насыщенный',
};



