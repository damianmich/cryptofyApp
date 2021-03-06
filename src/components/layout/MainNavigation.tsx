import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import type { RootState } from "../../store";
import { authActions } from "../../store/auth-slice";

import { cryptocurrenciesActions } from "../../store/cryptocurrencies-slice";
import "antd/dist/antd.css";
import { Layout, Menu } from "antd";
import {
  SlidersOutlined,
  UserOutlined,
  ProfileOutlined,
  FundOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";

const MainNavigation = React.memo(() => {
  const [collapsed, setCollapsed] = useState(true);
  const { Sider } = Layout;
  const isLogin = useSelector((state: RootState) => state.auth.isLogged);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(authActions.logout());
    dispatch(cryptocurrenciesActions.resetState());
    navigate("/");
  };

  const reset = () => {
    dispatch(
      cryptocurrenciesActions.searchingStatus({
        isSearching: false,
        searchingText: "",
      })
    );
  };
  console.log(document.body.clientHeight);

  let mobile = {};

  if (window.innerWidth < 992 && !collapsed) {
    mobile = {
      position: "fixed",
      zIndex: 10,
      height: "100vh",
    };
  } else if (window.innerWidth < 992 && collapsed) {
    mobile = {
      position: "fixed",
      height: document.body.clientHeight.toString(),
      zIndex: 0,
      transition: "0.25s ease",
    };
  }

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onClick={(e) => {
        setCollapsed(!collapsed);
      }}
      collapsed={window.innerWidth < 992 ? collapsed : false}
      style={mobile}
    >
      <div className={classes.logo}>CryptofyApp</div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[window.location.pathname]}
        onClick={(e) => {}}
        style={collapsed && window.innerWidth < 992 ? { display: "none" } : {}}
      >
        {isLogin && (
          <Menu.Item key="/cryptocurrencies/1" icon={<SlidersOutlined />}>
            <NavLink to={"/cryptocurrencies/1"}>Cryptocurrencies</NavLink>
          </Menu.Item>
        )}
        {!isLogin && (
          <Menu.Item key="/login" icon={<UserOutlined />}>
            <NavLink to={"/login"}>Login</NavLink>
          </Menu.Item>
        )}
        {isLogin && (
          <Menu.Item key="/profile" icon={<ProfileOutlined />}>
            <NavLink to={"/profile"}>Profile</NavLink>
          </Menu.Item>
        )}
        {isLogin && (
          <Menu.Item key="/news" icon={<FundOutlined />}>
            <NavLink to={"/news"}>News</NavLink>
          </Menu.Item>
        )}
        {isLogin && (
          <Menu.Item key="4" icon={<UserOutlined />}>
            <div onClick={logout}>Logout</div>
          </Menu.Item>
        )}
      </Menu>
    </Sider>
  );
});

export default MainNavigation;
