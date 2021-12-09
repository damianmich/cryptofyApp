import "./App.css";
import LayoutMain from "./components/layout/Layout";
import { Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { Fragment, Suspense, useEffect } from "react";
import {
  fetchCryptocurrenciesData,
  fetchGlobalStats,
} from "./store/cryptocurrencies-actions";
import { authActions } from "./store/auth-slice";
import React from "react";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import NewsPage from "./pages/NewsPage";

const CryptocurrenciesPage = React.lazy(
  () => import("./pages/CryptocurrenciesPage")
);
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const CryptocurrencyDetailPage = React.lazy(
  () => import("./pages/CryptocurrencyDetailPage")
);
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Home = React.lazy(() => import("./pages/Home"));

function App() {
  const dispatch = useDispatch();

  dispatch(authActions.initialStoredToken());
  let isLogin = useSelector((state: RootState) => state.auth.isLogged);

  const search = async () => {
    await dispatch(fetchCryptocurrenciesData("SEARCH"));
  };

  useEffect(() => {
    search();
    dispatch(fetchGlobalStats());
  }, []);

  return (
    <LayoutMain>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Fragment>
            <Route
              path="/"
              element={
                isLogin ? (
                  <Navigate replace to="/cryptocurrencies/1" />
                ) : (
                  <Home />
                )
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
            <Route
              path="/news"
              element={
                isLogin ? <NewsPage /> : <Navigate replace to="/login" />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Fragment>
        </Routes>
      </Suspense>
    </LayoutMain>
  );
}

export default App;
