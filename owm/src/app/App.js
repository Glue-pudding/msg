import React from "react";
import ReactDOM from "react-dom";
import { LocaleProvider,Affix,Popover,Icon,Radio,Button } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn";
import HorizonApp from "../modules/horizonGrid";
import InlineApp from "../modules/inlineGrid";

import styles from './App.less';
import {get} from '@/tools/axios';
import API from '@/tools/api';
const loadScript = require('load-script');
// loadScript("https://cdn.ckeditor.com/4.10.0/full/ckeditor.js");
loadScript("https://cdnjs.cloudflare.com/ajax/libs/ckeditor/4.10.0/ckeditor.js");
const RadioGroup = Radio.Group;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radioValue: 'horizontal'
    };
  }
  onSwitchChange=(checked)=>{
    console.log(`switch to ${checked}`);
  }
  onRadioChange=(e)=>{
    get({url:"/api/comment/get/3"}).then((res)=>{
      console.log(res)
    }).catch=(err)=>{
      console.log('==error==',err)
    }
    this.setState({radioValue:e.target.value})
  }
  render() {
    const {radioValue} = this.state;
    const toolCont=<div>
      <div>
        <p>布局方式：</p>
        <RadioGroup name="radiogroup" onChange={this.onRadioChange} defaultValue={radioValue}>
          <Radio value='horizontal'>水平布局</Radio>
          <Radio value='vertical'>垂直布局</Radio>
        </RadioGroup>
      </div>
      <hr />
      <div>
        <p>配色方案：</p>
        <p>配置修改theme.json文件</p>
      </div>
    </div>;
    return (
      <LocaleProvider locale={zhCN}>
          <HorizonApp />
      </LocaleProvider>
    );
  }
}

export default App;
