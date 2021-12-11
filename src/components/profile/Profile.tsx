import { Card, List, Pagination } from "antd";
import { Header } from "antd/lib/layout/layout";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../../store";
import {
  fetchCryptocurrenciesData,
  getUserData,
} from "../../store/cryptocurrencies-actions";
import CryptocurrencyItem from "../cryptocurrencies/CryptocurrencyItem";
import classes from "./Profile.module.css";

const Profile = React.memo(() => {
  const dispatch = useDispatch();
  const favoritesList = useSelector(
    (state: RootState) => state.cryptocurrencies.favorites
  );

  const [favoritesListLoaded, setFavoritesListLoaded] =
    useState<JSX.Element[]>();

  let favoritesListRender;

  const render = useCallback(async () => {
    if (favoritesList.length === 0) await dispatch(getUserData());

    favoritesList.map((item) => {
      dispatch(fetchCryptocurrenciesData("FAVORITES", "", item.id));
    });

    setFavoritesListLoaded(
      (prevState) =>
        (prevState = favoritesList.map((item) => (
          <CryptocurrencyItem
            key={item.id}
            item={{ ...item, isFavorite: true }}
          />
        )))
    );
    favoritesListRender = favoritesListLoaded;
  }, []);

  favoritesListRender = favoritesList.map((item) => (
    <CryptocurrencyItem key={item.id} item={{ ...item, isFavorite: true }} />
  ));

  useEffect(() => {
    render();
  }, []);

  return (
    <div className={classes.container}>
      {favoritesListRender.length > 0 ? (
        <div>
          <Header
            className="site-layout-sub-header-background"
            style={{
              paddingLeft: "5rem",
              backgroundColor: "",
              marginBottom: "1rem",
              color: "white",
              textAlign: "center",
              fontSize: "2.5rem",
              letterSpacing: "0.25rem",
            }}
          >
            Your favorite cryptocurrencies list
          </Header>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            dataSource={favoritesListRender}
            renderItem={(item) => (
              <List.Item>
                <Card>{item}</Card>
              </List.Item>
            )}
          />
        </div>
      ) : (
        <div className={classes.empty}>
          Your favorite list is empty. You can add with <p>⭐</p>
        </div>
      )}
    </div>
  );
});

export default Profile;
