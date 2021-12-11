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

    if (withData === "ALL") {
      http = `https://api.coinstats.app/public/v1/coins?skip=${nextPage}&limit=10&currency=USD`;
    } else if (withData === "SEARCH") {
      http = `https://api.coinstats.app/public/v1/coins?skip=0&limit=500&currency=USD`;
    } else {
      http = `https://api.coinstats.app/public/v1/coins/${cryptocurrencyId}?currency=USD`;
    }

    const fetchData = async () => {
      const response = await fetch(http);

      dispatch(cryptocurrenciesActions.loadingSpinner({ isLoading: false }));

      if (!response.ok) {
        throw new Error("Couldn't not fetch all data!");
      }
      const data = await response.json();

      return data;
    };

    try {
      const cryptoFetchData = await fetchData();

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

      const cryptocurrenciesDetail = withData === ("SINGLE" || "FAVORITES") && {
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

      if (withData === "ALL") {
        dispatch(
          cryptocurrenciesActions.loadCryptocurrencies({
            items: cryptocurrenciesDataAll,
          })
        );
      }
      if (withData === "SINGLE") {
        dispatch(
          cryptocurrenciesActions.loadSingleCryptocurrency({
            singleItem: cryptocurrenciesDetail,
          })
        );
      }
      if (withData === "FAVORITES") {
        dispatch(
          cryptocurrenciesActions.updateFavorites({
            items: cryptocurrenciesDetail,
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
      dispatch(cryptocurrenciesActions.loadingSpinner({ isLoading: false }));
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
export const fetchChart = (period: string, id: string) => {
  return async (dispatch: AppDispatch) => {
    const chart = async () => {
      const response = await fetch(
        `https://api.coinstats.app/public/v1/charts?period=${period}&coinId=${id}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Couldn't not send data!");
      }
      return data;
    };
    try {
      const responseChart = await chart();

      dispatch(
        cryptocurrenciesActions.loadChartSingleCryptocurrency({
          chartSingleItem: responseChart.chart.map(
            (item: (string | number)[]) => {
              const data = item[0] + "000";

              return {
                Date: new Date(+data).toLocaleString(),
                price: +(+item[1]).toFixed(2),
              };
            }
          ),
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchNewsData = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(cryptocurrenciesActions.loadingSpinner({ isLoading: true }));
    const news = async () => {
      const response = await fetch(
        `https://api.coinstats.app/public/v1/news/trending?skip=0&limit=10`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Couldn't not send data!");
      }
      return data;
    };
    try {
      const responseNews = await news();
      dispatch(cryptocurrenciesActions.loadingSpinner({ isLoading: false }));
      const newsData = responseNews.news.map(
        (item: {
          title: string;
          description: string;
          feedDate: string;
          imgURL: string;
          link: string;
        }) => ({
          title: item.title,
          description: item.description,
          feedDate: new Date(item.feedDate).toLocaleString(),
          imgURL: item.imgURL,
          link: item.link,
        })
      );
      dispatch(cryptocurrenciesActions.loadNewsData({ newsData: newsData }));
    } catch (error) {
      console.log(error);
    }
  };
};
