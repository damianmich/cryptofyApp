import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { Line, LineConfig } from "@ant-design/charts";
import { Descriptions } from "antd";
import { cryptocurrenciesActions } from "../../store/cryptocurrencies-slice";
import { menageUserData } from "../../store/cryptocurrencies-actions";
import classes from "./CryptocurrencyDetail.module.css";
import { currencyNumber, pctNumber } from "../helpers/Helpers";
import React from "react";

const CryptocurrencyDetail = React.memo(() => {
  const { singleItem, chartSingleItem } = useSelector(
    (state: RootState) => state.cryptocurrencies
  );

  const dispatch = useDispatch();

  const data = chartSingleItem.map(
    (item: { price: string; timestamp: string | number | Date }) => {
      return {
        Date: new Date(item.timestamp).toLocaleString(),
        scales: +(+item.price).toFixed(2),
      };
    }
  );

  const scale = Math.min(
    ...chartSingleItem.map((item: { price: any }) => +item.price)
  );

  const addToFavoriteHandler = () => {
    if (singleItem.isFavorite) {
      dispatch(
        cryptocurrenciesActions.removeFromFavorite({ item: singleItem })
      );
    }
    if (!singleItem.isFavorite)
      dispatch(cryptocurrenciesActions.addToFavorties({ item: singleItem }));
    dispatch(menageUserData());
  };

  const config = {
    data,
    padding: "auto",
    autoFit: true,
    xField: "Date",
    yField: "scales",
    yAxis: {
      minLimit: +scale.toFixed(2),
      label: {
        formatter: (val) => (+val).toFixed(3),
      },
    },
    xAxis: {
      tickCount: 5,
    },

    smooth: true,
  } as LineConfig;

  return (
    <Fragment>
      <div style={{ marginBottom: "2rem" }}>
        {/* <CryptocurrencyItem key={singleItem.id} item={singleItem} /> */}
        <Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item>
            <div className={classes.item}>
              {" "}
              <div className={classes["item-container"]}>
                {singleItem.rank}. {singleItem.name}{" "}
                <p
                  style={{
                    fontSize: "8rem",
                    marginBottom: "0",
                    cursor: "pointer",
                    color: singleItem.isFavorite ? "#1890ff" : "",
                  }}
                  onClick={addToFavoriteHandler}
                >
                  ⭐
                </p>
              </div>
              <div className={classes["item-container"]}>
                <img
                  style={{
                    marginLeft: "1rem",
                    width: "5rem",
                    height: "5rem",
                  }}
                  src={singleItem.logo_url}
                />
                <span
                  style={{
                    fontSize: "2rem",
                    marginBottom: "0",
                    marginLeft: "1rem",
                  }}
                >
                  ({singleItem.symbol})
                </span>
              </div>
            </div>
          </Descriptions.Item>
          <Descriptions.Item
            contentStyle={{
              fontWeight: 800,
              fontSize: "3rem",
              marginTop: "3rem",
              display: "flex",
              justifyContent: "center",
            }}
            labelStyle={{ fontSize: "3rem" }}
          >
            Price: {currencyNumber(+singleItem.price)}
          </Descriptions.Item>
          <Descriptions.Item
            label="24h change"
            style={{ fontWeight: 800 }}
            contentStyle={
              +pctNumber(singleItem.price_change_pct) > 0
                ? { color: "green" }
                : { color: "red" }
            }
          >
            {pctNumber(singleItem.price_change_pct)}%
          </Descriptions.Item>
          <Descriptions.Item label="24h volume">
            {currencyNumber(+singleItem.volume)}
          </Descriptions.Item>
          <Descriptions.Item
            label="24h volume change"
            contentStyle={
              +pctNumber(singleItem.volume_change_pct) > 0
                ? { color: "green" }
                : { color: "red" }
            }
          >
            {+pctNumber(singleItem.volume_change_pct)}
          </Descriptions.Item>
          <Descriptions.Item label="Marketcap">
            {currencyNumber(+singleItem.marketcap)}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Line {...config} />
    </Fragment>
  );
});

export default CryptocurrencyDetail;
