import { createSlice } from "@reduxjs/toolkit";
import { AdmDashboardSlice, ProductData, ProductStatsItem} from "../data/types";

const admDashboardSlice = createSlice({
  name: "admcustdashboard",
  initialState: {
    products: [],
    productStats: []
  } as AdmDashboardSlice,
  
  reducers: {
    getProducts: (state, action) => {
      state.products = action.payload
      console.log(state.products)
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
      console.log(state.productStats)
    }

  }
});

export const { 
  getProducts,
  calculateProductStat
} = admDashboardSlice.actions;

export default admDashboardSlice.reducer;

