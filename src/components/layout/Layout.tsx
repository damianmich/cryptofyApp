import React from "react";
import MainNavigation from "./MainNavigation";
import "antd/dist/antd.css";
import { Layout } from "antd";

const LayoutMain: React.FC = (props) => {
  const { Content, Footer } = Layout;
  return (
    <Layout style={{ minHeight: `${100}vh` }}>
      <MainNavigation />
      <Layout>
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          ©2021 Created by Damian Michalski
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutMain;
