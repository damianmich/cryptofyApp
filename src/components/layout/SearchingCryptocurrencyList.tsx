import { List } from "antd";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import store, { RootState } from "../../store";
import { cryptocurrenciesActions } from "../../store/cryptocurrencies-slice";
import classes from "./SearchingCryptocurrencyList.module.css";

const SearchingCryptocurrencyList: React.FC = () => {
  const { searchingText } = useSelector(
    (state: RootState) => state.cryptocurrencies
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [cryptoSearching, setCryptoSearching] = useState<
    { id: string; name: string }[]
  >([{ id: "", name: "" }]);

  useEffect(() => {
    const searching = store
      .getState()
      .cryptocurrencies.searchedItems.map((i) => ({ id: i.id, name: i.name }))
      .filter((i) => i.name.toLowerCase().includes(searchingText));
    setCryptoSearching(searching);
  }, [searchingText]);

  const onDetailHandler = (item: { id: string; name: string }) => {
    navigate(`/cryptocurrencies/detail/${item.id}`);

    dispatch(
      cryptocurrenciesActions.searchingStatus({
        searchingText: "",
        isSearching: false,
      })
    );
  };

  const searchingList = cryptoSearching.map((item) => {
    return { name: item.name, id: item.id };
  });

  return (
    <Fragment>
      {searchingText && (
        <Fragment>
          <List
            className={classes.listSearch}
            style={{ zIndex: 10, backgroundColor: "white" }}
            size="small"
            bordered
            dataSource={searchingList}
            renderItem={(item, index) =>
              index < 10 && (
                <List.Item
                  className={classes.item}
                  onClick={onDetailHandler.bind(this, item)}
                  style={{ cursor: "pointer" }}
                >
                  {item.name}
                </List.Item>
              )
            }
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default SearchingCryptocurrencyList;
