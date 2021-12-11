import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CryptocurrencyDetail from "../components/cryptocurrencies/CryptocurrencyDetail";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import store, { AppDispatch, RootState } from "../store";
import {
  fetchChart,
  fetchCryptocurrenciesData,
} from "../store/cryptocurrencies-actions";
import { cryptocurrenciesActions } from "../store/cryptocurrencies-slice";

const CryptocurrencyDetailPage = React.memo(() => {
  const { cryptocurrencyId } = useParams<string>();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector(
    (state: RootState) => state.cryptocurrencies
  );

  useEffect(() => {
    (async () => {
      await dispatch(fetchCryptocurrenciesData("SINGLE", "", cryptocurrencyId));
    })();
  }, [dispatch, cryptocurrencyId]);

  if (isLoading) {
    return <LoadingSpinner />;
  } else {
    return <CryptocurrencyDetail />;
  }
});

export default CryptocurrencyDetailPage;
