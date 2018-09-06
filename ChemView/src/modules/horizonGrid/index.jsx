import React from "react";
import RouteIndex from '../router/router'
import { LocaleProvider } from 'antd';
import { Link } from 'react-router-dom';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { Layout } from "antd";
import LogoUrl from './Logo.png';
import styles from "./index.less";
const { Header, Content } = Layout;
class horizonApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultKey: ["1"]
    };
  }
  render() {
    return (
      <LocaleProvider locale={zh_CN}><Layout>
        <Header style={{ width: "100%",position:'fixed',zIndex:1 }}>
          <div className={styles.logo}>
          <Link to={'/'}><img src={LogoUrl} /></Link>
          </div>
        </Header>
        <Content>
          <div style={{background:'#2E3C4A ',height:94,marginTop: 72 }}></div>
          <div>
            <RouteIndex />
          </div>
        </Content>
      </Layout></LocaleProvider>
    );
  }
}

export default horizonApp;
