import React from "react";
import {Link } from 'react-router-dom';
import RouteIndex from '../router/router'
import { Layout, Menu, Breadcrumb, Icon } from "antd";
import styles from "./index.less";
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
class horizonApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultKey: ["1"]
    };
  }
  render() {
    const {defaultKey} =this.state;
    return (
      <Layout>
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <div className={styles.logo} />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={defaultKey}
            style={{ lineHeight: "64px" }}
          >
            <Menu.Item key="1"><Link to='/app' >App</Link></Menu.Item>
            <Menu.Item key="2"><Link to='/tab' >Tab</Link></Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px", marginTop: 64 }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: "#fff", padding: 24, minHeight: 800 }}>
            <RouteIndex />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          React App ©2018 Created by Sam Chord
        </Footer>
      </Layout>
    );
  }
}

export default horizonApp;
