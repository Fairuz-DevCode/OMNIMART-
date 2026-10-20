import { CartItem } from '../../types';

export interface LocalOrderItem {
  id: string;
  orderNumber: string;
  items: CartItem[];
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  paidAt: number; // timestamp in milliseconds
  shopName: string;
  completedAt?: number; // timestamp when marked as completed manually or automatically
}

const STORAGE_KEY = 'ECOMMERCE_LOCAL_ORDERS';

let memoryOrders: LocalOrderItem[] = [];

export const getStoredOrders = (): LocalOrderItem[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    }
  } catch (e) {
    console.log('Error reading orders from localStorage:', e);
  }
  return memoryOrders;
};

export const saveOrder = (order: LocalOrderItem) => {
  try {
    const current = getStoredOrders();
    const updated = [order, ...current];
    memoryOrders = updated;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.log('Error saving order:', e);
  }
};

export const markOrderAsCompleted = (orderIdOrNumber: string) => {
  try {
    const current = getStoredOrders();
    const updated = current.map((ord) => {
      if (ord.id === orderIdOrNumber || ord.orderNumber === orderIdOrNumber) {
        return {
          ...ord,
          completedAt: Date.now(),
        };
      }
      return ord;
    });
    memoryOrders = updated;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.log('Error marking order completed:', e);
  }
};

/**
 * Returns dynamic status based on silent background cooldown:
 * - If order explicitly marked completed -> 'Selesai'
 * - 0 until 1 hour (3600000 ms) after payment: 'Dikemas'
 * - 1 hour until 25 hours (1h + 24h = 25h = 90000000 ms) after payment: 'Dikirim'
 * - > 25 hours: 'Selesai'
 */
export const getOrderStatus = (paidAt: number, completedAt?: number): 'Dikemas' | 'Dikirim' | 'Selesai' => {
  if (completedAt) {
    return 'Selesai';
  }

  const now = Date.now();
  const elapsed = now - paidAt;

  const ONE_HOUR = 60 * 60 * 1000;
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  const TOTAL_TO_FINISH = ONE_HOUR + TWENTY_FOUR_HOURS; // 25 hours

  if (elapsed < ONE_HOUR) {
    return 'Dikemas';
  } else if (elapsed < TOTAL_TO_FINISH) {
    return 'Dikirim';
  } else {
    return 'Selesai';
  }
};
