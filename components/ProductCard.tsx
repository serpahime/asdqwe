'use client';

import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { toastManager } from '@/components/Toast';
import { useTranslations, useLocale } from '@/hooks/useTranslations';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const t = useTranslations();
  const locale = useLocale();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toastManager.success(
      locale === 'uk' 
        ? `${product.name} додано в кошик!`
        : `${product.name} добавлен в корзину!`
    );
  };

  return (
    <Link href={`/${locale}/product/${product.slug}`} className="group block animate-fade-in">
      <div className="card h-full flex flex-col transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-neon-cyan/20">
        {/* Image */}
        <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden bg-dark-border">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.error-placeholder')) {
                  const placeholder = document.createElement('div');
                  placeholder.className = 'w-full h-full bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 flex items-center justify-center error-placeholder';
                  placeholder.innerHTML = '<span class="text-gray-500 text-sm">Немає зображення</span>';
                  parent.replaceChild(placeholder, target);
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Немає зображення</span>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-neon-cyan text-dark-bg text-xs font-bold px-2 py-1 rounded">
                {t.product.new}
              </span>
            )}
            {product.isHit && (
              <span className="bg-neon-purple text-white text-xs font-bold px-2 py-1 rounded">
                {t.product.hit}
              </span>
            )}
            {product.oldPrice && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{Math.round((1 - product.price / product.oldPrice) * 100)}%
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-neon-cyan transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm mb-4 flex-1">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-4">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-400">
              {product.rating} ({product.reviewsCount})
            </span>
          </div>

          {/* Price & Button */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-neon-cyan">
                {product.price} ₴
              </span>
              {product.oldPrice && (
                <span className="text-gray-500 line-through ml-2 text-sm">
                  {product.oldPrice} ₴
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="p-2.5 bg-dark-border hover:bg-neon-cyan hover:text-dark-bg rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={locale === 'uk' ? `Додати ${product.name} в кошик` : `Добавить ${product.name} в корзину`}
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

