import "./App.css";
import LayoutMain from "./components/layout/Layout";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import CryptocurrenciesPage from "./pages/CryptocurrenciesPage";
import { useDispatch, useSelector } from "react-redux";
import store, { AppDispatch, RootState } from "./store";
import { Fragment, useEffect, useState } from "react";
import {
  fetchCryptocurrenciesData,
  fetchGlobalStats,
  getUserData,
} from "./store/cryptocurrencies-actions";
import ProfilePage from "./pages/ProfilePage";
import CryptocurrencyDetailPage from "./pages/CryptocurrencyDetailPage";
import { authActions } from "./store/auth-slice";

function App() {
  const dispatch = useDispatch();

  dispatch(authActions.initialStoredToken());
  let isLogin = useSelector((state: RootState) => state.auth.isLogged);

  const search = async () => {
    await dispatch(fetchCryptocurrenciesData("SEARCH", ""));
  };

  useEffect(() => {
    search();
    dispatch(fetchGlobalStats());
  }, []);

  return (
    <LayoutMain>
      <Routes>
        <Fragment>
          <Route
            path="/"
            element={
              isLogin ? <Navigate replace to="/cryptocurrencies/1" /> : <Home />
            }
          />
          <Route
            path="/login"
            element={
              isLogin ? (
                <Navigate replace to="/cryptocurrencies/1" />
              ) : (
                <AuthPage />
              )
            }
          />
          <Route
            path={"/cryptocurrencies/:page"}
            element={
              isLogin ? (
                <CryptocurrenciesPage />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route
            path={"/cryptocurrencies/detail/:cryptocurrencyId"}
            element={
              isLogin ? (
                <CryptocurrencyDetailPage />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isLogin ? <ProfilePage /> : <Navigate replace to="/login" />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Fragment>
      </Routes>
    </LayoutMain>
  );
}

export default App;
