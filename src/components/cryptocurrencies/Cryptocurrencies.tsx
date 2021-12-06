import React from "react";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import CryptocurrenciesList from "./CryptocurrenciesList";

const Cryptocurrencies = React.memo(() => {
  const spinner = useSelector(
    (state: RootState) => state.cryptocurrencies.isLoading
  );
  return !spinner ? <CryptocurrenciesList /> : <Fragment />;
});

export default Cryptocurrencies;
