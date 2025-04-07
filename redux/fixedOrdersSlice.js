// redux/fixedOrdersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const fixedOrdersSlice = createSlice({
  name: 'fixedOrders',
  initialState: {
    orders: []
  },
  reducers: {
    setFixedOrders: (state, action) => {
      state.orders = action.payload;
    },
    updateFixedOrder: (state, action) => {
      const updatedOrder = action.payload;
      state.orders = state.orders.map(order =>
        order.id === updatedOrder.id ? updatedOrder : order
      );
    }
  }
});

export const { setFixedOrders, updateFixedOrder } = fixedOrdersSlice.actions;
export default fixedOrdersSlice.reducer;
