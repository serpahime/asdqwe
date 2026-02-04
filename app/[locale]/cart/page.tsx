'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShoppingCart, Sparkles, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toastManager } from '@/components/Toast';
import { CartItem } from '@/types';
import { useTranslations, useLocale } from '@/hooks/useTranslations';

export default function CartPage() {
  const { items: cartItems, total, removeItem, updateItem } = useCart();
  const t = useTranslations();
  const locale = useLocale();

  const handleRemove = (productId: string, productName: string) => {
    removeItem(productId);
    toastManager.info(
      locale === 'uk' 
        ? `${productName} видалено з кошика`
        : `${productName} удалён из корзины`
    );
  };

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove(item.id, item.name);
    } else {
      updateItem(item.id, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="section-padding min-h-screen flex items-center">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full flex items-center justify-center shadow-2xl shadow-neon-cyan/30">
                <ShoppingBag size={64} className="text-neon-cyan" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-neon-purple rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {t.cart.empty} <span className="gradient-text">{locale === 'uk' ? 'порожня' : 'пуста'}</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              {t.cart.emptyText}
            </p>
            <Link 
              href={`/${locale}/catalog`} 
              className="btn-primary inline-flex items-center space-x-2 text-lg group"
            >
              <span>{t.common.continueShopping}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="section-padding min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
            {t.cart.title} <span className="gradient-text">{locale === 'uk' ? 'покупок' : 'покупок'}</span>
          </h1>
          <div className="flex items-center space-x-2 text-gray-400">
            <Package size={18} />
            <span>{totalItems} {locale === 'uk' ? 'товарів' : 'товаров'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div 
                key={item.id} 
                className="card flex flex-col md:flex-row gap-4 md:gap-6 hover:border-neon-cyan/50 hover:shadow-lg hover:shadow-neon-cyan/10 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Background Gradient Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Image */}
                <Link 
                  href={`/${locale}/product/${item.slug}`}
                  className="relative w-full md:w-36 h-36 rounded-xl overflow-hidden bg-gradient-to-br from-dark-card via-dark-border to-dark-card flex-shrink-0 group/image"
                >
                  {item.images[0] && (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-card/50 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity"></div>
                </Link>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between relative z-10">
                  <div>
                    <Link 
                      href={`/${locale}/product/${item.slug}`}
                      className="text-xl md:text-2xl font-bold hover:text-neon-cyan transition-colors mb-3 block group-hover:translate-x-1 transition-transform"
                    >
                      {item.name}
                    </Link>
                    {item.selectedVariant && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.selectedVariant.volume && (
                          <span className="px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-semibold rounded-lg">
                            {locale === 'uk' ? 'Об\'єм' : 'Объём'}: {item.selectedVariant.volume}
                          </span>
                        )}
                        {item.selectedVariant.resistance && (
                          <span className="px-3 py-1 bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-semibold rounded-lg">
                            {locale === 'uk' ? 'Опір' : 'Сопротивление'}: {item.selectedVariant.resistance}
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        className="p-2 bg-dark-border hover:bg-neon-cyan hover:text-dark-bg rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95"
                        aria-label={locale === 'uk' ? 'Зменшити кількість' : 'Уменьшить количество'}
                      >
                        <Minus size={18} />
                      </button>
                      <span className="text-lg font-bold w-10 text-center bg-dark-border rounded-lg py-2">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        className="p-2 bg-dark-border hover:bg-neon-cyan hover:text-dark-bg rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95"
                        aria-label={locale === 'uk' ? 'Збільшити кількість' : 'Увеличить количество'}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      className="group/remove flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 hover:border-red-500/60 hover:from-red-500/20 hover:to-red-600/20 text-red-400 hover:text-red-300 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-red-500/20"
                      aria-label={t.cart.remove}
                    >
                      <Trash2 size={18} className="group-hover/remove:rotate-12 transition-transform duration-300 flex-shrink-0" />
                      <span className="text-sm font-semibold hidden sm:inline">{t.cart.remove}</span>
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="flex flex-col justify-between items-end relative z-10">
                  <div className="text-right">
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mb-2">
                      {item.price * item.quantity} ₴
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <span>{item.price} ₴</span>
                        <span className="text-gray-600">×</span>
                        <span>{item.quantity}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24 bg-gradient-to-br from-dark-card via-dark-card to-dark-card/80 border-2 border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-dark-border">
                <ShoppingCart size={22} className="text-neon-cyan" />
                <h2 className="text-2xl font-bold">{locale === 'uk' ? 'Підсумок' : 'Итого'}</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-dark-border/50 rounded-lg">
                  <span className="text-gray-400 flex items-center space-x-2">
                    <Package size={16} />
                    <span>{t.cart.items}</span>
                  </span>
                  <span className="font-semibold text-white">{totalItems}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-lg border border-neon-cyan/20">
                  <span className="text-lg font-bold">{t.cart.sum}:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                    {total} ₴
                  </span>
                </div>
              </div>

              <Link 
                href={`/${locale}/checkout`}
                className="btn-primary w-full text-center block mb-4 group"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{t.checkout.title}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link 
                href={`/${locale}/catalog`}
                className="btn-secondary w-full text-center block group"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{t.common.continueShopping}</span>
                  <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


