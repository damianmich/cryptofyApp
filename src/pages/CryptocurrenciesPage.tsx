import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import Cryptocurrencies from "../components/cryptocurrencies/Cryptocurrencies";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import store, { AppDispatch, RootState } from "../store";
import {
  fetchCryptocurrenciesData,
  getUserData,
} from "../store/cryptocurrencies-actions";

const CryptocurrenciesPage = React.memo(() => {
  const { page } = useParams<string>();
  const isLoading = useSelector(
    (store: RootState) => store.cryptocurrencies.isLoading
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      await dispatch(getUserData());
      dispatch(fetchCryptocurrenciesData("ALL", page));
    })();
  }, [dispatch, page]);

  if (isLoading) {
    return <LoadingSpinner />;
  } else return <Cryptocurrencies />;
});

export default CryptocurrenciesPage;
