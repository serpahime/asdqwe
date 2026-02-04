'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingCart, Star, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '@/lib/data';
import { useCart } from '@/contexts/CartContext';
import { Product, ProductVariant } from '@/types';
import ProductCard from '@/components/ProductCard';
import ProductVariantSelector from '@/components/ProductVariantSelector';
import { toastManager } from '@/components/Toast';
import Link from 'next/link';
import { useTranslations, useLocale } from '@/hooks/useTranslations';
import { logger } from '@/lib/logger';

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const locale = params?.locale as string || 'uk';
  const product = products.find(p => p.slug === slug);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVolume, setSelectedVolume] = useState<string>('');
  const [selectedResistance, setSelectedResistance] = useState<string>('');
  const { addItem } = useCart();
  const t = useTranslations();
  const currentLocale = useLocale();

  // Initialize default variants
  useEffect(() => {
    if (product?.variants) {
      if (product.variants.volumes && product.variants.volumes.length > 0 && !selectedVolume) {
        setSelectedVolume(product.variants.volumes[0]);
      }
      if (product.variants.resistances && product.variants.resistances.length > 0 && !selectedResistance) {
        const defaultResistance = selectedVolume === '3 мл' 
          ? product.variants.resistances.find(r => r.includes('3мл')) || product.variants.resistances[0]
          : product.variants.resistances.find(r => !r.includes('3мл')) || product.variants.resistances[0];
        if (defaultResistance) {
          setSelectedResistance(defaultResistance);
        }
      }
    }
  }, [product, selectedVolume]);

  useEffect(() => {
    if (product?.variants?.resistances) {
      if (selectedVolume === '2 мл') {
        const availableResistances = product.variants.resistances.filter(r => !r.includes('3мл'));
        if (availableResistances.length > 0 && !availableResistances.includes(selectedResistance)) {
          setSelectedResistance(availableResistances[0]);
        }
      } else if (selectedVolume === '3 мл') {
        if (!product.variants.resistances.includes(selectedResistance)) {
          const defaultResistance = product.variants.resistances.find(r => r.includes('3мл')) || product.variants.resistances[0];
          if (defaultResistance) {
            setSelectedResistance(defaultResistance);
          }
        }
      }
    }
  }, [selectedVolume, product, selectedResistance]);

  // Логування перегляду товару
  useEffect(() => {
    if (product) {
      logger.logProduct('view', {
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        category: product.category,
        price: product.price,
      });
    }
  }, [product?.id]);

  if (!product) {
    logger.warn('product', 'Product not found', { slug });
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">{t.common.notFound}</h1>
          <Link href={`/${currentLocale}/catalog`} className="btn-primary">
            {t.common.backToCatalog}
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.isHit))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!product) {
      logger.error('product', 'Attempted to add non-existent product to cart', undefined, { slug });
      return;
    }
    
    try {
      if (product.variants) {
        if (product.variants.volumes && !selectedVolume) {
          logger.warn('product', 'Volume not selected for product with variants', undefined, { 
            productId: product.id, 
            productName: product.name 
          } as any);
          toastManager.warning(currentLocale === 'uk' ? 'Будь ласка, виберіть об\'єм' : 'Пожалуйста, выберите объём');
          return;
        }
        if (product.variants.resistances && !selectedResistance) {
          logger.warn('product', 'Resistance not selected for product with variants', undefined, { 
            productId: product.id, 
            productName: product.name 
          } as any);
          toastManager.warning(currentLocale === 'uk' ? 'Будь ласка, виберіть опір' : 'Пожалуйста, выберите сопротивление');
          return;
        }
      }

      const productWithVariant: Product & { selectedVariant?: ProductVariant } = {
        ...product,
        selectedVariant: {
          volume: selectedVolume || undefined,
          resistance: selectedResistance || undefined,
        },
      };

      addItem(productWithVariant, quantity);
      
      logger.logProduct('add_to_cart', {
        productId: product.id,
        productName: product.name,
        quantity,
        volume: selectedVolume,
        resistance: selectedResistance,
        price: product.price,
        totalPrice: (product.price * quantity).toFixed(2),
      });
      
      const variantText = selectedVolume || selectedResistance 
        ? ` (${[selectedVolume, selectedResistance].filter(Boolean).join(', ')})` 
        : '';
      const successText = currentLocale === 'uk'
        ? `${product.name}${variantText} (${quantity} шт.) додано в кошик!`
        : `${product.name}${variantText} (${quantity} шт.) добавлен в корзину!`;
      toastManager.success(successText);
    } catch (error) {
      logger.error('product', 'Failed to add product to cart', error as Error, {
        productId: product.id,
        productName: product.name,
        quantity,
      });
      toastManager.error(currentLocale === 'uk' ? 'Помилка додавання товару в кошик' : 'Ошибка добавления товара в корзину');
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="section-padding">
      <div className="container-custom">
        <nav className="mb-6 text-sm text-gray-400">
          <Link href={`/${currentLocale}`} className="hover:text-neon-cyan">{t.header.home}</Link>
          {' / '}
          <Link href={`/${currentLocale}/catalog`} className="hover:text-neon-cyan">{t.header.catalog}</Link>
          {' / '}
          <span className="text-gray-300">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="relative">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-dark-border mb-4">
              {product.images[selectedImageIndex] ? (
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 flex items-center justify-center">
                  <span className="text-gray-500">Немає зображення</span>
                </div>
              )}
              
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-dark-bg/80 hover:bg-dark-bg text-white p-2.5 md:p-2 rounded-full transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={currentLocale === 'uk' ? 'Попереднє зображення' : 'Предыдущее изображение'}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-dark-bg/80 hover:bg-dark-bg text-white p-2.5 md:p-2 rounded-full transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={currentLocale === 'uk' ? 'Наступне зображення' : 'Следующее изображение'}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-colors touch-manipulation ${
                      selectedImageIndex === index
                        ? 'border-neon-cyan'
                        : 'border-transparent hover:border-dark-border'
                    }`}
                    aria-label={currentLocale === 'uk' ? `Зображення ${index + 1} з ${product.images.length}` : `Изображение ${index + 1} из ${product.images.length}`}
                    aria-current={selectedImageIndex === index ? 'true' : 'false'}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex gap-2 mb-4">
              {product.isNew && (
                <span className="bg-neon-cyan text-dark-bg text-xs font-bold px-3 py-1 rounded">
                  {t.product.new}
                </span>
              )}
              {product.isHit && (
                <span className="bg-neon-purple text-white text-xs font-bold px-3 py-1 rounded">
                  {t.product.hit}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {product.name}
            </h1>

            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-gray-400">
                {product.rating} ({product.reviewsCount} {t.product.reviews})
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-neon-cyan">
                  {product.price} ₴
                </span>
                {product.oldPrice && (
                  <span className="text-2xl text-gray-500 line-through">
                    {product.oldPrice} ₴
                  </span>
                )}
              </div>
            </div>

            {product.variants && (
              <ProductVariantSelector
                product={product}
                selectedVolume={selectedVolume}
                selectedResistance={selectedResistance}
                onVolumeChange={setSelectedVolume}
                onResistanceChange={setSelectedResistance}
              />
            )}

            <p className="text-gray-300 mb-6 text-lg">
              {product.fullDescription}
            </p>

            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-gray-400">{t.common.quantity}:</span>
                <div className="flex items-center space-x-2 border border-dark-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-dark-border transition-all duration-200 transform hover:scale-110 active:scale-95 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={currentLocale === 'uk' ? 'Зменшити кількість' : 'Уменьшить количество'}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center font-semibold" aria-label={currentLocale === 'uk' ? `Кількість: ${quantity}` : `Количество: ${quantity}`}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-dark-border transition-all duration-200 transform hover:scale-110 active:scale-95 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={currentLocale === 'uk' ? 'Збільшити кількість' : 'Увеличить количество'}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full btn-primary flex items-center justify-center space-x-2 transform transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <ShoppingCart size={20} />
                <span>{t.common.addToCart}</span>
              </button>
            </div>

            <div className="card">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t.product.category}:</span>
                  <span className="text-gray-300">
                    {product.category === 'fruits' ? (currentLocale === 'uk' ? 'Ягідні' : 'Ягодные') : 
                     product.category === 'mint' ? (currentLocale === 'uk' ? 'Ментол / освіжаючі' : 'Ментол / освежающие') :
                     product.category === 'dessert' ? (currentLocale === 'uk' ? 'Десерт' : 'Десерт') : 
                     (currentLocale === 'uk' ? 'Аксесуари' : 'Аксессуары')}
                  </span>
                </div>
                {product.variants && (selectedVolume || selectedResistance) && (
                  <>
                    {selectedVolume && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">{currentLocale === 'uk' ? 'Об\'єм' : 'Объём'}:</span>
                        <span className="text-gray-300">{selectedVolume}</span>
                      </div>
                    )}
                    {selectedResistance && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">{currentLocale === 'uk' ? 'Опір' : 'Сопротивление'}:</span>
                        <span className="text-gray-300">{selectedResistance}</span>
                      </div>
                    )}
                  </>
                )}
                {!product.variants && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t.product.strength}:</span>
                    <span className="text-gray-300">
                      {product.strength === 'light' ? (currentLocale === 'uk' ? 'Легкий' : 'Лёгкий') :
                       product.strength === 'medium' ? (currentLocale === 'uk' ? 'Середній' : 'Средний') : 
                       (currentLocale === 'uk' ? 'Насичений' : 'Насыщенный')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="border-b border-dark-border mb-6">
            <div className="flex space-x-8">
              <button className="pb-4 border-b-2 border-neon-cyan text-neon-cyan font-semibold">
                {currentLocale === 'uk' ? 'Опис' : 'Описание'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">{t.product.composition}</h3>
              <ul className="space-y-2">
                {product.composition.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2 text-gray-300">
                    <span className="w-2 h-2 bg-neon-cyan rounded-full"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">{t.product.instructions}</h3>
              <p className="text-gray-300 leading-relaxed">{product.instructions}</p>
            </div>
          </div>
        </div>

        <div className="card bg-red-500/10 border-red-500/50 mb-12">
          <p className="text-red-400 font-semibold mb-2">⚠️ {t.product.warning}</p>
          <p className="text-gray-300 text-sm">
            {t.product.warningText}
          </p>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-display font-bold mb-8">
              {t.product.related} <span className="gradient-text">{currentLocale === 'uk' ? 'товари' : 'товары'}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


