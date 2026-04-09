import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'powergym_cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.productId === item.productId);
      
      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + quantity;
        
        // Check stock availability
        if (newQuantity > item.stock) {
          throw new Error(`Cannot add more than ${item.stock} items`);
        }
        
        return prevItems.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: newQuantity }
            : i
        );
      } else {
        // Add new item
        if (quantity > item.stock) {
          throw new Error(`Cannot add more than ${item.stock} items`);
        }
        
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) => {
      const item = prevItems.find((i) => i.productId === productId);
      
      if (item && quantity > item.stock) {
        throw new Error(`Cannot add more than ${item.stock} items`);
      }
      
      return prevItems.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prevItems) => prevItems.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const getItemQuantity = (productId: number) => {
    const item = items.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getItemCount,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
