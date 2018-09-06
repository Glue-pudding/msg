import React from 'react';
import {Row, Col, Checkbox, Button} from 'antd';

export default class PanelCont extends React.Component {
  constructor(props) {
    super(props);
    console.log(props,'"===props==="');
    // this.toggleComplete = this.toggleComplete.bind(this);
    // this.deleteTask = this.deleteTask.bind(this);
  }
  render() {
    let list = this.props.news,styles=this.props.redText;
    let listCont = list.map(function(item,index){
      let str = `${item.name} : ${item.desc}`;
      return <li key={index}><label className={styles}>{str}</label></li>;
    });
    // console.log(list,'"===list==="');
    return (<div>
      <h2>{this.props.title}</h2>
    </div>
    );
  }
}