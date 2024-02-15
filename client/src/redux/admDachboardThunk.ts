import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';

export const calculateTopProducts = createAsyncThunk(
  'admdashboard/calculateTopProducts',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const orders = state.admin.orders;

    const productPopularity: Record<string, number> = {};
    orders.forEach(order => {
      order.products && order.products.forEach(product => {
        productPopularity[product.title] = (productPopularity[product.title] || 0) + product.quantity;
      });
    });

    const topProducts = Object.entries(productPopularity)
      .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
      .slice(0, 5)
      .map(([title]) => title);


    return topProducts;
    
  }
);
