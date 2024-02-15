import { createSlice } from "@reduxjs/toolkit";
import { AdmDashboardSlice} from "../data/types";
import { calculateTopProducts } from "./admDachboardThunk";

const admDashboardSlice = createSlice({
  name: "admdashboard",
  initialState: {
    favoriteProducts: [],
    loading: false, // Добавлено
    error: null // Добавлено
  } as AdmDashboardSlice,
  
  reducers: {
    
  },
  extraReducers:  (builder) => {
    builder
      .addCase(calculateTopProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateTopProducts.fulfilled, (state, action) => {
        state.favoriteProducts = action.payload;
        state.loading = false;
      })
      .addCase(calculateTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось получить данные о популярных продуктах';
      });
  }
});

export default admDashboardSlice.reducer;

