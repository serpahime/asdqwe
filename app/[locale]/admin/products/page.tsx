'use client';

import { useEffect, useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Eye,
  EyeOff,
  Package,
  Download,
  X
} from 'lucide-react';
import { products } from '@/lib/data';
import { Product } from '@/types';
import { useLocale } from '@/hooks/useLocale';
import { toastManager } from '@/components/Toast';
import Link from 'next/link';

const PRODUCTS_STORAGE_KEY = 'juicelab_products';

// Получить товары из localStorage или использовать дефолтные
function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return products;
  
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Сохраняем дефолтные товары при первом запуске
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    return products;
  } catch {
    return products;
  }
}

// Сохранить товары
function saveProducts(productsList: Product[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsList));
}

export default function AdminProductsPage() {
  const locale = useLocale();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [productsList, searchQuery]);

  const loadProducts = () => {
    const stored = getStoredProducts();
    setProductsList(stored);
  };

  const filterProducts = () => {
    let filtered = [...productsList];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!selectedProduct) return;

    const updated = productsList.map((p) =>
      p.id === selectedProduct.id ? { ...p, ...formData } : p
    );
    
    setProductsList(updated);
    saveProducts(updated);
    setIsEditing(false);
    setSelectedProduct(null);
    toastManager.success(
      locale === 'uk' ? 'Товар оновлено' : 'Товар обновлён'
    );
  };

  const handleDelete = (productId: string) => {
    if (confirm(locale === 'uk' ? 'Видалити товар?' : 'Удалить товар?')) {
      const updated = productsList.filter((p) => p.id !== productId);
      setProductsList(updated);
      saveProducts(updated);
      toastManager.success(
        locale === 'uk' ? 'Товар видалено' : 'Товар удалён'
      );
    }
  };

  const handleToggleStatus = (productId: string) => {
    // В реальном приложении здесь будет поле isActive
    toastManager.info(
      locale === 'uk' ? 'Функція в розробці' : 'Функция в разработке'
    );
  };

  const exportToCSV = () => {
    const headers = [
      locale === 'uk' ? 'ID' : 'ID',
      locale === 'uk' ? 'Назва' : 'Название',
      locale === 'uk' ? 'Ціна' : 'Цена',
      locale === 'uk' ? 'Категорія' : 'Категория',
      locale === 'uk' ? 'Продажі' : 'Продажи',
    ];
    
    const rows = filteredProducts.map((product) => [
      product.id,
      product.name,
      product.price.toString(),
      product.category,
      '0', // В реальном приложении берется из аналитики
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Подсчет статистики
  const stats = {
    total: productsList.length,
    active: productsList.length, // В реальном приложении фильтруется по isActive
    totalRevenue: 0, // В реальном приложении берется из аналитики
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            {locale === 'uk' ? 'Товари' : 'Товары'}
          </h1>
          <p className="text-gray-400">
            {locale === 'uk' 
              ? `Всього: ${stats.total} товарів`
              : `Всего: ${stats.total} товаров`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>{locale === 'uk' ? 'Експорт CSV' : 'Экспорт CSV'}</span>
          </button>
          <Link
            href={`/${locale}/catalog`}
            className="btn-primary flex items-center space-x-2"
          >
            <Package size={20} />
            <span>{locale === 'uk' ? 'Переглянути каталог' : 'Просмотреть каталог'}</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
              <Package className="text-dark-bg" size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">
            {locale === 'uk' ? 'Всього товарів' : 'Всего товаров'}
          </h3>
          <p className="text-3xl font-bold text-neon-cyan">{stats.total}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center">
              <Eye className="text-dark-bg" size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">
            {locale === 'uk' ? 'Активних' : 'Активных'}
          </h3>
          <p className="text-3xl font-bold text-neon-purple">{stats.active}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-blue rounded-lg flex items-center justify-center">
              <Package className="text-dark-bg" size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">
            {locale === 'uk' ? 'Дохід з товарів' : 'Доход с товаров'}
          </h3>
          <p className="text-3xl font-bold text-neon-pink">{stats.totalRevenue} ₴</p>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'uk' ? 'Пошук товарів...' : 'Поиск товаров...'}
            className="w-full bg-dark-border border border-dark-border rounded-lg pl-10 pr-4 py-2 text-gray-300 focus:outline-none focus:border-neon-cyan"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Товар' : 'Товар'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Категорія' : 'Категория'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Ціна' : 'Цена'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Продажі' : 'Продажи'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Дохід' : 'Доход'}
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Дії' : 'Действия'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    {locale === 'uk' ? 'Товари не знайдено' : 'Товары не найдены'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-dark-border hover:bg-dark-border/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-300 font-medium">{product.name}</p>
                        <p className="text-gray-500 text-xs">{product.id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      {product.category}
                    </td>
                    <td className="py-3 px-4 text-neon-cyan font-semibold">
                      {product.price} ₴
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      0 {/* В реальном приложении берется из аналитики */}
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      0 ₴ {/* В реальном приложении берется из аналитики */}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/${locale}/product/${product.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-neon-cyan hover:bg-dark-border rounded transition-colors"
                          title={locale === 'uk' ? 'Переглянути' : 'Просмотреть'}
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                          title={locale === 'uk' ? 'Редагувати' : 'Редактировать'}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title={locale === 'uk' ? 'Видалити' : 'Удалить'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && selectedProduct && (
        <div className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-card border border-dark-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-dark-border flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {locale === 'uk' ? 'Редагувати товар' : 'Редактировать товар'}
              </h2>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedProduct(null);
                }}
                className="text-gray-400 hover:text-neon-cyan"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'uk' ? 'Назва' : 'Название'}
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'uk' ? 'Ціна' : 'Цена'}
                </label>
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'uk' ? 'Опис' : 'Описание'}
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSave}
                  className="btn-primary flex-1"
                >
                  {locale === 'uk' ? 'Зберегти' : 'Сохранить'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedProduct(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  {locale === 'uk' ? 'Скасувати' : 'Отменить'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

