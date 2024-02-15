import { createSlice } from "@reduxjs/toolkit";
import { CustDashboardSlice, OrderData, OrderStatsItem, ProductData, ProductStatsItem} from "../data/types";

const custDashboardSlice = createSlice({
  name: "custdashboard",
  initialState: {
    products: [],
    productStats: [],
    orders:[],
    ordersStats:[],
    totalAmount: 0,
    monthAmount:[]
  } as CustDashboardSlice,
  
  reducers: {
    getProducts: (state, action) => {
      state.products = action.payload
    },
    calculateProductStat: (state) => {
      const categoryCounts: { [key: string]: number } = {};
      state.products.forEach((product: ProductData) => {
        if (product.category in categoryCounts) {
          categoryCounts[product.category]++;
        } else {
          categoryCounts[product.category] = 1;
        }
      });
      const productStats = Object.entries(categoryCounts).map(([categoryTitle, quantity]): ProductStatsItem => ({
        categoryTitle,
        quantity: quantity
      }));

      state.productStats = productStats;
    },
    getOrders: (state, action) => {
      state.orders = action.payload;
    },
    calculateOrdersStat: (state) => {
      const statusCounts: { [key: string]: number } = {};
      const statuses = ['На рассмотрении', 'Подтверждена', 'Оплачена', 'Выполнена', 'Аннулирована'];
      statuses.forEach(status => {
        statusCounts[status] = 0;
      });
      state.orders.forEach((order: OrderData) => {
        if (order.status && order.status in statusCounts) {
          statusCounts[order.status]++;
        }
      });
      const ordersStats = Object.entries(statusCounts).map(([statusTitle, quantity]): OrderStatsItem => ({
        statusTitle,
        quantity
      }));

      state.ordersStats = ordersStats;

    }
  }
});

export const { 
  getProducts,
  calculateProductStat,
  getOrders,
  calculateOrdersStat
} = custDashboardSlice.actions;

export default custDashboardSlice.reducer;

