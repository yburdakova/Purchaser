import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import { OrderData, ProductData } from '../data/types'; // Укажите правильный путь к вашим типам

export const calculateTopProducts = createAsyncThunk(
    'admdashboard/calculateTopProducts',
    (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const orders: OrderData[] =  state.admin.orders;

        const productPopularity: Record<string, number> = {};
        orders.forEach((order: OrderData) => {
            order.products?.forEach((product: ProductData) => {
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
