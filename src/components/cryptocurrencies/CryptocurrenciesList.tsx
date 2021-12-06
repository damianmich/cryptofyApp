import { Descriptions, Input, Pagination } from "antd";
import { ChangeEvent, Fragment, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { RootState } from "../../store";
import { cryptocurrenciesActions } from "../../store/cryptocurrencies-slice";
import CryptocurrencyItem from "./CryptocurrencyItem";
import classes from "./CryptocurrenciesList.module.css";
import "antd/dist/antd.css";
import { List, Card } from "antd";
import { Header } from "antd/lib/layout/layout";
import SearchingCryptocurrencyList from "../layout/SearchingCryptocurrencyList";
import { currencyNumber } from "../helpers/Helpers";
import React from "react";

const CryptocurrenciesList = React.memo(() => {
  const dispatch = useDispatch();

  const {
    isLoading: spinner,
    items: cryptoItems,
    searchingText,
    globalStatsData,
  } = useSelector((state: RootState) => state.cryptocurrencies);

  const setInputHandle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    dispatch(
      cryptocurrenciesActions.searchingStatus({
        isSearching: true,
        searchingText: newInput,
      })
    );
  }, []);

  const { page } = useParams<string>();
  const navigate = useNavigate();

  const numberOfPage: number | undefined = Number(page);
  const pagination = (page: number) => {
    const pageString = page.toString();
    navigate(`/cryptocurrencies/${pageString}`);
  };

  return (
    <Fragment>
      <div>
        <Descriptions
          title="Global statistic information"
          bordered
          column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="Coins">
            {globalStatsData.totalCoins}
          </Descriptions.Item>
          <Descriptions.Item label="Markets">
            {globalStatsData.totalMarkets}
          </Descriptions.Item>
          <Descriptions.Item label="Exchanges">
            {globalStatsData.totalExchanges}
          </Descriptions.Item>
          <Descriptions.Item label="MarketCap">
            {currencyNumber(globalStatsData.totalMarketCap)}
          </Descriptions.Item>
          <Descriptions.Item label="24h volume">
            {currencyNumber(globalStatsData.total24hVolume)}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <Header
        className="site-layout-sub-header-background"
        style={{
          paddingLeft: "5rem",
          backgroundColor: "",
          marginBottom: "1rem",
        }}
      >
        <Input
        className={classes.searchInput}
          placeholder="Search coin"
          onChange={setInputHandle}
          value={searchingText}
        />
        <SearchingCryptocurrencyList />
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
        dataSource={cryptoItems}
        renderItem={(item) => (
          <List.Item>
            <Card>
              <CryptocurrencyItem item={item} />
            </Card>
          </List.Item>
        )}
      />
      {!spinner && (
        <Pagination
          defaultCurrent={numberOfPage}
          total={100}
          onChange={pagination}
          className={classes.pagination}
        />
      )}
    </Fragment>
  );
});

export default CryptocurrenciesList;
