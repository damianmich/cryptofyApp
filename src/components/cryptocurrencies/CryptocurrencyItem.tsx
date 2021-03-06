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
import { StarOutlined } from "@ant-design/icons";
import { message } from "antd";

export const CryptocurrencyItem: React.FC<{
  item: CryptoItem;
}> = React.memo((props) => {
  const dispatch = useDispatch();

  const addToFavoriteHandler = () => {
    if (props.item.isFavorite) {
      message.success("Removed from favorite's");
      dispatch(
        cryptocurrenciesActions.removeFromFavorite({ item: props.item })
      );
    }
    if (!props.item.isFavorite) {
      message.success("Added to the favorite's");
      dispatch(cryptocurrenciesActions.addToFavorties({ item: props.item }));
    }
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
            <p onClick={addToFavoriteHandler} className={classes.star}>
              <StarOutlined
                style={{
                  color: `${props.item.isFavorite ? "#ff0000" : "black"}`,
                }}
              />
            </p>
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
            {props.item.price_change_pct}%
          </span>
        </div>
      </div>
    </Fragment>
  );
});

export default CryptocurrencyItem;
