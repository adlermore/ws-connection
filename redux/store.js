// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import authMiddleware from './authMiddleware';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import locationReducer from './locationSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    location: locationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authMiddleware),
});
