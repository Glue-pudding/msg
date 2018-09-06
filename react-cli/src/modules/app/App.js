import React from "react";
import ReactDOM from "react-dom";
import { LocaleProvider,Affix,Popover,Icon,Radio} from "antd";
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from "antd/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
import HorizonApp from "../horizonGrid";
import InlineApp from "../inlineGrid";
import styles from './App.less';
import {get} from '@/tools/axios';
import API from '@/tools/api';
moment.locale("zh-cn");
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
    let url = API.GET_COMMENT.replace(':id',3);
    get({url,params:{name:'geg'}}).then((res)=>{
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
    </div>
    return (
      <LocaleProvider locale={zhCN}>
        <div>
          <Affix className={styles.affixBox}>
            <Popover content={toolCont} placement="bottomRight" title="个性化设置"><Icon type="setting" /></Popover>
          </Affix>
          {radioValue==='horizontal'?<HorizonApp />:<InlineApp />}
        </div>
      </LocaleProvider>
    );
  }
}

export default App;
