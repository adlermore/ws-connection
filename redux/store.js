// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import authMiddleware from './authMiddleware';
import cartReducer from './cartSlice';
import locationReducer from './locationSlice'; 
import fixedOrdersReducer from './fixedOrdersSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    location: locationReducer,
    fixedOrders: fixedOrdersReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authMiddleware),
});
