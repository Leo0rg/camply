import { createSlice } from '@reduxjs/toolkit';

const cartItemsFromStorage = localStorage.getItem('cartItems') 
  ? JSON.parse(localStorage.getItem('cartItems')) 
  : [];

const initialState = {
  cartItems: cartItemsFromStorage,
  totalPrice: cartItemsFromStorage.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ),
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existItem = state.cartItems.find(
        (item) => item.product === product._id
      );

      if (existItem) {
        // Если товар уже в корзине, увеличиваем количество
        state.cartItems = state.cartItems.map((item) =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Если товара нет в корзине, добавляем его
        state.cartItems.push({ 
          product: product._id, 
          name: product.name, 
          image: product.image, 
          price: product.price, 
          countInStock: product.countInStock, 
          quantity, 
          description: product.description 
        });
      }
      
      // Пересчитываем общую стоимость
      state.totalPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      
      // Сохраняем корзину в localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Если количество 0 или меньше, удаляем товар из корзины
        state.cartItems = state.cartItems.filter((item) => item.product !== productId);
      } else {
        // Иначе обновляем количество
        state.cartItems = state.cartItems.map((item) =>
          item.product === productId ? { ...item, quantity } : item
        );
      }
      
      // Пересчитываем общую стоимость
      state.totalPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      
      // Сохраняем корзину в localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.product !== productId);
      
      // Пересчитываем общую стоимость
      state.totalPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      
      // Сохраняем корзину в localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    
    clearCart: (state) => {
      state.cartItems = [];
      state.totalPrice = 0;
      
      // Очищаем корзину в localStorage
      localStorage.setItem('cartItems', JSON.stringify([]));
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectTotalPrice = (state) => state.cart.totalPrice;

export default cartSlice.reducer;
