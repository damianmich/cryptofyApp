import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import cryptocurrenciesSlice from "./cryptocurrencies-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cryptocurrencies: cryptocurrenciesSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
