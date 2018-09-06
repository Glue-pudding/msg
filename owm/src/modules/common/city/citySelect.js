/**
 * 城市省市级级联选择器
 * author：Sam Chord
 * method:
 *  onChange:级联选择变化
 * time:08-07-2018
 */
import React from 'react';
import { Cascader } from "antd";
import cityData from "./cityJson";
function filter(inputValue, path) {
    return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
}
function initList(){
    const addr = [];
    const province = Object.keys(cityData);
  
    for (let pItem in province) {
      const key = province[pItem];
      const cityList = [];
      if (cityData[key].length > 0) {
        for (let cItem in cityData[key]) {
          const obj = {
            value: cityData[key][cItem],
            label: cityData[key][cItem]
          };
          cityList.push(obj);
        }
      }
      const obj = {
        value: key,
        label: key,
        children: cityList
      };
  
      addr.push(obj);
    }
    return addr;
}

function CityCascader(props) {
  const {cityChange,style,city} = props;
  function onChange(value, selectedOptions) {
    cityChange(value, selectedOptions);
  }
  return (
    <Cascader style={style} defaultValue={city||["浙江省","杭州市"]} placeholder='请选择' options={initList()} onChange={onChange} showSearch={{filter}} ></Cascader>
  );
}
export default CityCascader;
