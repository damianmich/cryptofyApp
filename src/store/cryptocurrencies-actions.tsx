import store, { AppDispatch } from ".";
import CryptoItem from "../models/cryptoItem";
import { cryptocurrenciesActions } from "./cryptocurrencies-slice";

export const fetchCryptocurrenciesData = (
  withData: string,
  page = "1" as string,
  cryptocurrencyId = "" as string
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(cryptocurrenciesActions.loadingSpinner({ isLoading: true }));
    let http = "";
    let nextPage = page === "1" ? 0 : +page * 10 - 10;
    console.log(withData);

    if (withData === "ALL") {
      http = `https://api.coinstats.app/public/v1/coins?skip=${nextPage}&limit=10&currency=USD`;
    } else if (withData === "SEARCH") {
      http = `https://api.coinstats.app/public/v1/coins?skip=0&limit=500&currency=USD`;
    } else {
      http = `https://api.coinstats.app/public/v1/coins/${cryptocurrencyId}?currency=USD`;
    }

    // http =
    //   withData === "ALL"
    //     ? `https://api.coinstats.app/public/v1/coins?skip=${nextPage}&limit=10&currency=USD`
    //     : http;
    // http =
    //   withData === "SEARCH"
    //     ? `https://api.coinstats.app/public/v1/coins?skip=0&limit=500&currency=USD`
    //     : http;
    // http =
    //   withData === "SINGLE" || "FAVORITES"
    //     ? `https://api.coinstats.app/public/v1/coins/${cryptocurrencyId}?currency=USD`
    //     : http;
    console.log(http);

    const fetchData = async () => {
      const response = await fetch(
        // `https://api.nomics.com/v1/currencies/ticker?key=cc97b5f2fbf3456675c688a53c90a64792cf2e9a${
        //   cryptocurrencyId && `&ids=${cryptocurrencyId}`
        // }&interval=1d&convert=USD&status=active${
        //   page && `&per-page=10&page=${page}`
        // }`
        http
      );

      dispatch(cryptocurrenciesActions.loadingSpinner({ isLoading: false }));

      if (!response.ok) {
        throw new Error("Couldn't not fetch all data!");
      }
      const data = await response.json();

      return data;
    };

    try {
      const cryptoFetchData = await fetchData();
      console.log(cryptoFetchData);

      const cryptocurrenciesDataSearch: CryptoItem[] =
        withData === "SEARCH" &&
        cryptoFetchData.coins.map((item: any) => ({
          id: item.id,
          name: item.name,
        }));
      const cryptocurrenciesDataAll =
        withData === "ALL" &&
        cryptoFetchData.coins.map((item: any) => ({
          id: item.id,
          rank: item.rank,
          name: item.name,
          price: item.price,
          logo_url: item.icon,
          symbol: item.symbol,
          marketcap: item.marketCap,
          volume: item.volume,
          price_change_pct: item.priceChange1d,
          volume_change_pct: item.priceChange1d,
        }));

      if (withData === "ALL") {
        dispatch(
          cryptocurrenciesActions.loadCryptocurrencies({
            items: cryptocurrenciesDataAll,
          })
        );
      }
      if (withData === "SINGLE") {
        const singleItem = {
          id: cryptoFetchData.coin.id,
          rank: cryptoFetchData.coin.rank,
          name: cryptoFetchData.coin.name,
          price: cryptoFetchData.coin.price,
          logo_url: cryptoFetchData.coin.icon,
          symbol: cryptoFetchData.coin.symbol,
          marketcap: cryptoFetchData.coin.marketCap,
          volume: cryptoFetchData.coin.volume,
          price_change_pct: cryptoFetchData.coin.priceChange1d,
          volume_change_pct: cryptoFetchData.coin.priceChange1d,
        };

        dispatch(
          cryptocurrenciesActions.loadSingleCryptocurrency({
            singleItem: singleItem,
          })
        );
      }
      if (withData === "FAVORITES") {
        const favorite = {
          id: cryptoFetchData.coin.id,
          rank: cryptoFetchData.coin.rank,
          name: cryptoFetchData.coin.name,
          price: cryptoFetchData.coin.price,
          logo_url: cryptoFetchData.coin.icon,
          symbol: cryptoFetchData.coin.symbol,
          marketcap: cryptoFetchData.coin.marketCap,
          volume: cryptoFetchData.coin.volume,
          price_change_pct: cryptoFetchData.coin.priceChange1d,
          volume_change_pct: cryptoFetchData.coin.priceChange1d,
        };
        dispatch(
          cryptocurrenciesActions.updateFavorites({
            items: favorite,
          })
        );
      }
      if (withData === "SEARCH") {
        await dispatch(
          cryptocurrenciesActions.loadSearchCryptocurrencies({
            searchedItems: cryptocurrenciesDataSearch,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const menageUserData = () => {
  return async () => {
    const menageData = async () => {
      const favorites = store.getState().cryptocurrencies.favorites;
      const localId = store.getState().auth.localId;
      const token = store.getState().auth.token;

      const response = await fetch(
        `https://react-course-c5002-default-rtdb.firebaseio.com/${localId.toString()}.json`,
        {
          method: "PUT",
          body: JSON.stringify({ token: token, favorites: favorites }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Couldn't not send data!");
      }
      return data;
    };
    try {
      const responseSaveUserData = await menageData();
    } catch (error) {
      console.log(error);
    }
  };
};

export const getUserData = () => {
  return async (dispatch: AppDispatch) => {
    const saveData = async () => {
      const localId = store.getState().auth.localId;

      const response = await fetch(
        `https://react-course-c5002-default-rtdb.firebaseio.com/${localId.toString()}.json`
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Couldn't not send data!");
      }
      return data;
    };
    try {
      const responseSaveUserData = await saveData();

      dispatch(
        cryptocurrenciesActions.initUserData({
          token: responseSaveUserData.token,
          favorites: responseSaveUserData.favorites
            ? responseSaveUserData.favorites
            : [],
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};
export const fetchChartData = (id: string) => {
  return async (dispatch: AppDispatch) => {
    const chartData = async () => {
      const symbol = store.getState().cryptocurrencies.singleItem.symbol;

      const response = await fetch(
        `https://coinranking1.p.rapidapi.com/coins?symbols=${symbol}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "coinranking1.p.rapidapi.com",
            "x-rapidapi-key":
              "45354d86c3mshd61617f44c06f7ep1b634cjsnc41e18ba90e0",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Couldn't not send data!");
      }
      return data;
    };
    try {
      const responseChartSymbol = await chartData();
      const fetchChartById = async (id: string) => {
        const response = await fetch(
          `https://coinranking1.p.rapidapi.com/coin/${id}/history/7d`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "coinranking1.p.rapidapi.com",
              "x-rapidapi-key":
                "45354d86c3mshd61617f44c06f7ep1b634cjsnc41e18ba90e0",
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Couldn't not send data!");
        }
        return data;
      };
      try {
        const responseChartById = await fetchChartById(
          responseChartSymbol.data.coins["0"].id
        );
        dispatch(
          cryptocurrenciesActions.loadChartSingleCryptocurrency({
            chartSingleItem: responseChartById.data.history,
          })
        );
      } catch (error) {}
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchGlobalStats = () => {
  return async (dispatch: AppDispatch) => {
    const globalStats = async () => {
      const response = await fetch(
        "https://coinranking1.p.rapidapi.com/stats",
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "coinranking1.p.rapidapi.com",
            "x-rapidapi-key":
              "45354d86c3mshd61617f44c06f7ep1b634cjsnc41e18ba90e0",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Couldn't not send data!");
      }
      return data;
    };
    try {
      const responseGlobalStats = await globalStats();
      dispatch(
        cryptocurrenciesActions.loadGlobalStatsData({
          globalStatsData: responseGlobalStats.data,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};
