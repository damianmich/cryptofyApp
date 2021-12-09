import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../../store";
import { Line, LineConfig } from "@ant-design/charts";
import { Descriptions, message, Select } from "antd";
import { cryptocurrenciesActions } from "../../store/cryptocurrencies-slice";
import {
  fetchChart,
  getUserData,
  menageUserData,
} from "../../store/cryptocurrencies-actions";
import classes from "./CryptocurrencyDetail.module.css";
import { currencyNumber, pctNumber } from "../helpers/Helpers";
import React from "react";
import StarOutlined from "@ant-design/icons/lib/icons/StarOutlined";

const CryptocurrencyDetail = () => {
  const { singleItem, chartSingleItem } = useSelector(
    (state: RootState) => state.cryptocurrencies
  );
  const [timeChange, setTimeChange] = useState("24h");
  const [sign, setSign] = useState<number>(+singleItem.price_change_pct);

  const { Option } = Select;
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(getUserData());
      await dispatch(
        cryptocurrenciesActions.loadSingleCryptocurrency({
          singleItem: store.getState().cryptocurrencies.singleItem,
        })
      );
      await dispatch(
        fetchChart("24h", store.getState().cryptocurrencies.singleItem.id)
      );
    })();
  }, []);

  const scale = Math.min(
    ...chartSingleItem.map(
      (item: { scales: any }) => +item.scales - +item.scales * 0.1
    )
  );

  const addToFavoriteHandler = () => {
    if (singleItem.isFavorite) {
      message.success("Removed from favorite's");
      dispatch(
        cryptocurrenciesActions.removeFromFavorite({ item: singleItem })
      );
    }
    if (!singleItem.isFavorite) {
      message.success("Added to the favorite's");
      dispatch(cryptocurrenciesActions.addToFavorties({ item: singleItem }));
    }
    dispatch(menageUserData());
  };

  const handleChange = async (value: string) => {
    await dispatch(fetchChart(value, singleItem.id));
    setTimeChange(value);
  };

  const data = chartSingleItem;
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

  useEffect(() => {
    const onePct = chartSingleItem[chartSingleItem.length - 1].scales / 100;
    const priceDifference =
      chartSingleItem[chartSingleItem.length - 1].scales -
      chartSingleItem[0].scales;
    const change = priceDifference / onePct;
    setSign(+change.toFixed(2));
  }, [chartSingleItem]);

  return (
    <Fragment>
      <div style={{ marginBottom: "2rem" }}>
        <Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item>
            <div className={classes.item}>
              {" "}
              <div className={classes["item-container"]}>
                {singleItem.rank}. {singleItem.name}{" "}
                <p
                  style={{
                    fontSize: "5rem",
                    marginBottom: "0rem",
                    marginLeft: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={addToFavoriteHandler}
                >
                  <StarOutlined
                    style={{
                      color: `${singleItem.isFavorite ? "#ff0000" : ""}`,
                    }}
                  />
                </p>
              </div>
              <div className={classes["item-container"]}>
                <img
                  src={singleItem.logo_url}
                  style={{
                    marginLeft: "1rem",
                    width: "5rem",
                    height: "5rem",
                  }}
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
            label={`${timeChange} change`}
            style={{ fontWeight: 800 }}
            contentStyle={sign > 0 ? { color: "green" } : { color: "red" }}
          >
            {sign}%
          </Descriptions.Item>
          <Descriptions.Item label="24h volume">
            {currencyNumber(+singleItem.volume)}
          </Descriptions.Item>

          <Descriptions.Item label="Marketcap">
            {currencyNumber(+singleItem.marketcap)}
          </Descriptions.Item>
        </Descriptions>
        <div>
          <Select
            defaultValue="24h"
            style={{ width: 120 }}
            onChange={handleChange}
          >
            <Option value="24h">24h</Option>
            <Option value="1w">1w</Option>
            <Option value="1m">1m</Option>
            <Option value="3m">3m</Option>
            <Option value="6m">6m</Option>
            <Option value="1y">1y</Option>
          </Select>
        </div>
      </div>

      <Line {...config} />
    </Fragment>
  );
};

export default CryptocurrencyDetail;
