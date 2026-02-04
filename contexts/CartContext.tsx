'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import { getCart, addToCart, removeFromCart, updateCartItem, getCartTotal, getCartItemsCount, clearCart as clearCartStorage } from '@/lib/cart';
import { logger } from '@/lib/logger';

interface CartContextType {
  items: CartItem[];
  total: number;
  itemsCount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateItem: (productId: string, quantity: number) => void;
  clearCart: () => void;
  refresh: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [itemsCount, setItemsCount] = useState(0);

  const refresh = () => {
    const cartItems = getCart();
    setItems(cartItems);
    setTotal(getCartTotal());
    setItemsCount(getCartItemsCount());
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    refresh();
    
    // Listen for storage changes (in case of multiple tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aromaflavor_cart') {
        refresh();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    const handleCartUpdate = () => {
      refresh();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const addItem = (product: Product, quantity: number = 1) => {
    if (!product || !product.id) {
      logger.error('cart', 'Invalid product data', undefined, { product });
      throw new Error('Invalid product data');
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      logger.error('cart', 'Invalid quantity', undefined, { quantity });
      throw new Error('Invalid quantity');
    }

    try {
      addToCart({
        ...product,
        quantity,
      });
      refresh();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdated'));
      }
      // Логування вже виконується в addToCart, не дублюємо
    } catch (error) {
      logger.error('cart', 'Failed to add item to cart', error as Error, { productId: product.id });
      throw error;
    }
  };

  const removeItem = (productId: string) => {
    if (!productId) {
      logger.error('cart', 'Invalid product ID', undefined, { productId });
      throw new Error('Invalid product ID');
    }

    try {
      removeFromCart(productId);
      refresh();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdated'));
      }
      // Логування вже виконується в removeFromCart, не дублюємо
    } catch (error) {
      logger.error('cart', 'Failed to remove item from cart', error as Error, { productId });
      throw error;
    }
  };

  const updateItem = (productId: string, quantity: number) => {
    if (!productId) {
      logger.error('cart', 'Invalid product ID', undefined, { productId });
      throw new Error('Invalid product ID');
    }

    if (quantity < 0 || !Number.isInteger(quantity)) {
      logger.error('cart', 'Invalid quantity', undefined, { quantity });
      throw new Error('Invalid quantity');
    }

    try {
      updateCartItem(productId, quantity);
      refresh();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdated'));
      }
      // Логування вже виконується в updateCartItem, не дублюємо
    } catch (error) {
      logger.error('cart', 'Failed to update cart item', error as Error, { productId, quantity });
      throw error;
    }
  };

  const clearCart = () => {
    try {
      clearCartStorage(); // Використовуємо функцію з lib/cart.ts
      refresh();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdated'));
      }
      // Логування вже виконується в clearCartStorage, не дублюємо
    } catch (error) {
      logger.error('cart', 'Failed to clear cart', error as Error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemsCount,
        addItem,
        removeItem,
        updateItem,
        clearCart,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

