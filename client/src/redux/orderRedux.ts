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
      const productToAdd: ProductData = action.payload;
      const existingProductIndex = state.products.findIndex(product => product._id === productToAdd._id);
      if (existingProductIndex >= 0) {
        state.products[existingProductIndex].quantity += productToAdd.quantity;
      } else {
        state.products.push(productToAdd);
      }
      state.quantity = state.products.length;
      state.totalPrice = state.products.reduce((total, product) => total + product.price * product.quantity, 0);
    },

    updateProductQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const productIndex = state.products.findIndex(product => product._id === productId);
      if (productIndex >= 0) {
        state.products[productIndex].quantity = quantity;
        state.totalPrice = state.products.reduce((total, product) => total + product.price * product.quantity, 0);
      }
    },

    deleteProduct: (state, action) => {
      const productId = action.payload;
      state.products = state.products.filter(product => product._id !== productId);
      state.quantity = state.products.length;
      state.totalPrice = state.products.reduce((total, product) => total + product.price * product.quantity, 0);
    },

    cleanOrder: (state) => {
      state.products = [];
      state.quantity = 0;
      state.totalPrice = 0;
      state.isOpen = false;
    },

    openOrder: (state, action) => {
      state.isOpen = action.payload;
    },

    closeOrder: (state) => {
      state.isOpen = false;
    },
  },
});

export const { 
  addProduct, 
  updateProductQuantity, 
  deleteProduct, 
  cleanOrder,
  openOrder
} = orderSlice.actions;

export default orderSlice.reducer;
