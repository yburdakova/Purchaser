import { createSlice } from "@reduxjs/toolkit";
import { OrderState, ProductData } from "../data/types.ts";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    products: [] as ProductData[],
    quantity: 0,
    totalPrice: 0,
    isOpen: false,
  } as OrderState,
  
  reducers: {
    addProduct: (state, action) => {
      const existingProductIndex = state.products.findIndex(product => product._id === action.payload._id);
      if (existingProductIndex >= 0) {
        state.products[existingProductIndex].quantity += action.payload.quantity;
      } else {
        state.products.push({ ...action.payload, quantity: action.payload.quantity });
      }
      state.quantity = state.products.reduce((total, product) => total + product.quantity, 0);
      state.totalPrice = state.products.reduce((total, product) => total + product.price * product.quantity, 0);
    },
    openOrder: (state, action) => {
        state.isOpen = action.payload;
    },
    updateProductQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingProductIndex = state.products.findIndex(product => product._id === productId);
      if (existingProductIndex >= 0 && quantity >= 0) {
        state.products[existingProductIndex].quantity = quantity;
      }
      state.quantity = state.products.reduce((total, product) => total + product.quantity, 0);
      state.totalPrice = state.products.reduce((total, product) => total + product.price * product.quantity, 0);
    },

    deleteProduct: (state, action) => {
      const { productId } = action.payload;
      state.products = state.products.filter(product => product._id !== productId);
      state.quantity = state.products.reduce((total, product) => total + product.quantity, 0);
      state.totalPrice = state.products.reduce((total, product) => total + product.price * product.quantity, 0);

      if (state.products.length === 0) {
        state.totalPrice = 0;
      } 
    },

    cleanOrder: (state) => {
      state.products = [];
      state.quantity = 0;
      state.totalPrice = 0;
    },
  }
});

export const { 
  addProduct, 
  updateProductQuantity, 
  deleteProduct, 
  cleanOrder,
  openOrder
} = orderSlice.actions;

export default orderSlice.reducer;
