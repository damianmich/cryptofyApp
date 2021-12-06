import React, { useCallback } from "react";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import CryptoItem from "../../models/cryptoItem";
import { menageUserData } from "../../store/cryptocurrencies-actions";
import { cryptocurrenciesActions } from "../../store/cryptocurrencies-slice";
import {
  currencyMarketCap,
  currencyNumber,
  pctNumber,
} from "../helpers/Helpers";
import classes from "./CryptocurrencyItem.module.css";

export const CryptocurrencyItem: React.FC<{
  item: CryptoItem;
}> = React.memo((props) => {
  const dispatch = useDispatch();

  const addToFavoriteHandler = () => {
    if (props.item.isFavorite) {
      dispatch(
        cryptocurrenciesActions.removeFromFavorite({ item: props.item })
      );
    }
    if (!props.item.isFavorite)
      dispatch(cryptocurrenciesActions.addToFavorties({ item: props.item }));
    dispatch(menageUserData());
  };

  return (
    <Fragment>
      <div>
        <div className={classes.name}>
          <div className={classes["crypto-name"]}>
            <span className={classes.rank}>{props.item.rank}. </span>
            <Link to={`/cryptocurrencies/detail/${props.item.id}`}>
              {props.item.name}
            </Link>
            <div
              className={
                props.item.isFavorite
                  ? classes["favorite-true"]
                  : classes.favorite
              }
              onClick={addToFavoriteHandler}
            >
              ⭐
            </div>
          </div>

          <img className={classes.logo} src={props.item.logo_url} />
        </div>
        <div className={classes.price}>
          <span>Price: {currencyNumber(+props.item.price)}</span>
        </div>
        <div className={classes.marketcap}>
          <span>MarketCap: {currencyMarketCap(+props.item.marketcap)}</span>
        </div>
        <div className={classes.pct}>
          24h change:
          <span
            style={
              +pctNumber(props.item.price_change_pct) > 0
                ? { backgroundColor: "green" }
                : { backgroundColor: "red" }
            }
          >
            {pctNumber(props.item.price_change_pct)}
          </span>
        </div>
      </div>
    </Fragment>
  );
});

export default CryptocurrencyItem;
