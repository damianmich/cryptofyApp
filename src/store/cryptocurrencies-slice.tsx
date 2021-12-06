import { createSlice } from "@reduxjs/toolkit";
import CryptoItem from "../models/cryptoItem";

const initialState = {
  items: [] as CryptoItem[],
  singleItem: {} as CryptoItem,
  chartSingleItem: [] as any,
  isLoading: false,
  isSearching: false,
  searchingText: "",
  favorites: [] as CryptoItem[],
  searchedItems: [] as CryptoItem[],
  globalStatsData: {} as any,
};

const cryptocurrenciesSlice = createSlice({
  name: "cryptocurrencies",
  initialState: initialState,
  reducers: {
    loadCryptocurrencies(state, action) {
      state.items = action.payload.items;

      if (state.favorites.length > 0) {
        state.items.map((item, i) => {
          if (state.favorites.find((crypto) => crypto.name === item.name))
            state.items[i] = { ...item, isFavorite: true };
        });
      }
    },
    loadSearchCryptocurrencies(state, action) {
      state.searchedItems = action.payload.searchedItems;
    },
    loadSingleCryptocurrency(state, action) {
      state.singleItem = action.payload.singleItem;

      if (
        state.favorites.find(
          (crypto) => crypto.name === action.payload.singleItem.name
        )
      ) {
        state.singleItem = { ...action.payload.singleItem, isFavorite: true };
      }
    },
    loadChartSingleCryptocurrency(state, action) {
      state.chartSingleItem = action.payload.chartSingleItem;
    },
    loadingSpinner(state, action) {
      state.isLoading = action.payload.isLoading;
    },
    searchingStatus(state, action) {
      state.isSearching = action.payload.isSearching;
      state.searchingText = action.payload.searchingText;
    },
    addToFavorties(state, action) {
      const existingItem = state.favorites.find(
        (crypto) => crypto.name === action.payload.item.name
      );

      const index = state.items.findIndex(
        (crypto) => crypto.name === action.payload.item.name
      );

      if (!existingItem) {
        state.items[index] && (state.items[index].isFavorite = true);
        state.singleItem.isFavorite = true;
        state.favorites.push(action.payload.item);
      }
    },
    removeFromFavorite(state, action) {
      const existingItem = state.favorites.find(
        (crypto) => crypto.name === action.payload.item.name
      );
      const index = state.items.findIndex(
        (crypto) => crypto.name === action.payload.item.name
      );

      state.items[index] && (state.items[index].isFavorite = false);
      state.singleItem.isFavorite = false;
      state.favorites = state.favorites.filter(
        (crypto) => crypto !== existingItem
      );
    },
    updateFavorites(state, action) {
      state.favorites = action.payload.items;
    },
    resetState(state) {
      state.favorites = [];
      state.items = [];
    },
    initUserData(state, action) {
      state.favorites = action.payload.favorites;
    },
    loadGlobalStatsData(state, action) {
      state.globalStatsData = action.payload.globalStatsData;
    },
  },
});

export const cryptocurrenciesActions = cryptocurrenciesSlice.actions;

export default cryptocurrenciesSlice;
