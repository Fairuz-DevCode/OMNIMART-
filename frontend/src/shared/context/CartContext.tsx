import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '../../types';
import { useAuth } from './AuthContext';
import { apiFetch } from '../services/api';

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  totalAmount: number;
  totalItemsCount: number;
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['1', '4']);

  // Map API cart item response to frontend CartItem
  const mapBackendItems = (backendItems: any[]): CartItem[] => {
    return backendItems.map((item: any) => {
      const prod = item.product || {};
      const numericPrice = Number(prod.price || 0);
      return {
        id: item.id,
        quantity: item.quantity,
        product: {
          id: String(prod.id || item.product_id),
          name: prod.name || 'Produk',
          category: prod.category || 'Umum',
          price: numericPrice,
          oldPrice: prod.oldPrice || prod.old_price ? Number(prod.oldPrice || prod.old_price) : undefined,
          imageUrl: prod.imageUrl || prod.image_url || 'https://images.unsplash.com/photo-1506521782023-6058fda68c83?q=80&w=500&auto=format&fit=crop',
          rating: Number(prod.rating || 4.8),
          reviewsCount: Number(prod.reviewsCount || prod.reviews_count || 100),
          badge: prod.badge,
          description: prod.description || '',
          isPopular: !!prod.is_popular,
        },
      };
    });
  };

  // Fetch cart from backend
  const refreshCart = useCallback(async () => {
    if (!token) {
      return;
    }
    try {
      setIsLoading(true);
      const res = await apiFetch('/cart', { method: 'GET' }, token);
      if (res && res.data && Array.isArray(res.data.items)) {
        setCartItems(mapBackendItems(res.data.items));
      }
    } catch (err) {
      console.log('Error refreshing cart from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Sync when token changes (login / logout)
  useEffect(() => {
    if (token) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [token, refreshCart]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    const qtyToAdd = Math.max(1, quantity);

    // Optimistic update
    setCartItems((prev) => {
      const existing = prev.find((item) => String(item.product.id) === String(product.id));
      if (existing) {
        return prev.map((item) =>
          String(item.product.id) === String(product.id)
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }
      return [...prev, { product, quantity: qtyToAdd }];
    });

    // If logged in, persist to backend table
    if (token) {
      try {
        const res = await apiFetch(
          '/cart/items',
          {
            method: 'POST',
            body: JSON.stringify({
              product_id: product.id,
              quantity: qtyToAdd,
            }),
          },
          token
        );

        if (res && res.data && Array.isArray(res.data.items)) {
          setCartItems(mapBackendItems(res.data.items));
        }
      } catch (err) {
        console.log('Error syncing addToCart to backend:', err);
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    // Optimistic update
    setCartItems((prev) => prev.filter((item) => String(item.product.id) !== String(productId)));

    // Backend sync
    if (token) {
      try {
        const res = await apiFetch(`/cart/items/${productId}`, { method: 'DELETE' }, token);
        if (res && res.data && Array.isArray(res.data.items)) {
          setCartItems(mapBackendItems(res.data.items));
        }
      } catch (err) {
        console.log('Error removing cart item from backend:', err);
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    // Optimistic update
    setCartItems((prev) =>
      prev.map((item) =>
        String(item.product.id) === String(productId) ? { ...item, quantity } : item
      )
    );

    // Backend sync
    if (token) {
      try {
        const res = await apiFetch(
          `/cart/items/${productId}`,
          {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
          },
          token
        );
        if (res && res.data && Array.isArray(res.data.items)) {
          setCartItems(mapBackendItems(res.data.items));
        }
      } catch (err) {
        console.log('Error updating quantity in backend:', err);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);

    if (token) {
      try {
        await apiFetch('/cart', { method: 'DELETE' }, token);
      } catch (err) {
        console.log('Error clearing cart in backend:', err);
      }
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  // Normalize prices to full Rupiah values
  const totalAmount = cartItems.reduce((sum, item) => {
    const rawPrice = Number(item.product.price) || 0;
    const finalPrice = rawPrice < 1000 ? rawPrice * 1000 : rawPrice;
    return sum + finalPrice * item.quantity;
  }, 0);

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        totalAmount,
        totalItemsCount,
        wishlistIds,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
