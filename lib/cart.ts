import { CartItem } from '@/types';
import { logger } from './logger';

const CART_STORAGE_KEY = 'aromaflavor_cart';

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    const items = cart ? JSON.parse(cart) : [];
    logger.debug('cart', 'Cart retrieved', { itemsCount: items.length });
    return items;
  } catch (error) {
    logger.error('cart', 'Failed to get cart', error as Error);
    return [];
  }
};

export const addToCart = (item: CartItem): void => {
  if (typeof window === 'undefined') {
    throw new Error('addToCart can only be called on client side');
  }

  // Валідація даних
  if (!item || !item.id || !item.name || typeof item.price !== 'number' || item.price < 0) {
    logger.warn('cart', 'Invalid cart item data', { item });
    throw new Error('Invalid cart item data');
  }

  if (item.quantity <= 0 || !Number.isInteger(item.quantity)) {
    logger.warn('cart', 'Invalid quantity', { quantity: item.quantity });
    throw new Error('Invalid quantity');
  }

  try {
    const cart = getCart();
    const existingItem = cart.find((i) => i.id === item.id);
    
    if (existingItem) {
      const oldQuantity = existingItem.quantity;
      existingItem.quantity += item.quantity;
      logger.logCart('update_quantity', { 
        productId: item.id, 
        oldQuantity,
        newQuantity: existingItem.quantity 
      });
    } else {
      cart.push(item);
      logger.logCart('add_new_item', { 
        productId: item.id, 
        productName: item.name,
        quantity: item.quantity,
        price: item.price 
      });
    }
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    logger.error('cart', 'Failed to add item to cart', error as Error, { productId: item.id });
    throw error;
  }
};

export const removeFromCart = (productId: string): void => {
  try {
    const cart = getCart();
    const item = cart.find((i) => i.id === productId);
    const filteredCart = cart.filter((item) => item.id !== productId);
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filteredCart));
    
    logger.logCart('remove_item', { 
      productId, 
      productName: item?.name,
      previousCartSize: cart.length,
      newCartSize: filteredCart.length 
    });
  } catch (error) {
    logger.error('cart', 'Failed to remove item from cart', error as Error, { productId });
    throw error;
  }
};

export const updateCartItem = (productId: string, quantity: number): void => {
  try {
    const cart = getCart();
    const item = cart.find((i) => i.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        const oldQuantity = item.quantity;
        item.quantity = quantity;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        
        logger.logCart('update_item_quantity', { 
          productId, 
          oldQuantity, 
          newQuantity: quantity 
        });
      }
    } else {
      logger.warn('cart', 'Item not found for update', { productId, quantity });
    }
  } catch (error) {
    logger.error('cart', 'Failed to update cart item', error as Error, { productId, quantity });
    throw error;
  }
};

export const clearCart = (): void => {
  try {
    const cart = getCart();
    const itemsCount = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    localStorage.removeItem(CART_STORAGE_KEY);
    
    logger.logCart('clear_cart', { 
      itemsCount, 
      total: total.toFixed(2),
      clearedAt: new Date().toISOString() 
    });
  } catch (error) {
    logger.error('cart', 'Failed to clear cart', error as Error);
    throw error;
  }
};

export const getCartTotal = (): number => {
  try {
    return getCart().reduce((total, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      if (isNaN(itemTotal) || !isFinite(itemTotal)) {
        logger.warn('cart', 'Invalid item total calculated', { item });
        return total;
      }
      return total + itemTotal;
    }, 0);
  } catch (error) {
    logger.error('cart', 'Failed to calculate cart total', error as Error);
    return 0;
  }
};

export const getCartItemsCount = (): number => {
  try {
    return getCart().reduce((count, item) => {
      const quantity = item.quantity || 0;
      if (!Number.isInteger(quantity) || quantity < 0) {
        logger.warn('cart', 'Invalid item quantity', { item });
        return count;
      }
      return count + quantity;
    }, 0);
  } catch (error) {
    logger.error('cart', 'Failed to calculate cart items count', error as Error);
    return 0;
  }
};





