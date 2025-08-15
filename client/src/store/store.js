import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  // Redux Toolkit уже включает thunk по умолчанию, не нужно добавлять его отдельно
});

export default store;
