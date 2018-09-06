/**
 * 富文本编辑器
 * @参数：
 * props
 *    -id: 编辑器唯一标示
 *    -value: 编辑器初始值
 * getValue  编辑器内容改变时回调函数
 * 
 * @author 徐涛 2018-07-27
 */
import React from "react";
import PropTypes from "prop-types";
import {ClassicConfig,InlineConfig} from  './editConfig';
class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config:{...props.config}
    };
  }
  componentDidMount(){
    const {config} = this.state;
    const { getValue} = this.props;
    let t=this;
    const {id,type}=config;
    const CKEDITOR = window.CKEDITOR;
    CKEDITOR.replace(config.id,type==='inline'?InlineConfig:ClassicConfig);
    CKEDITOR.instances[id].on("change", function(ele) {
        let data = CKEDITOR.instances[id].getData();
        t.setState({config:{...t.state.config,value:data}});
        getValue(data);
      });
  }
  componentWillUnmount(){
    const {config} = this.state;
    const CKEDITOR = window.CKEDITOR;
    if(CKEDITOR.instances[config.id]){      
      CKEDITOR.instances[config.id].destroy();
    }
  }
  render() {
    const { config } = this.state;
    return (
      <textarea id={config.id} name={config.id} defaultValue={config.value} ></textarea>
    );
  }
}
Editor.propTypes = {
    getValue:PropTypes.func,
    config:PropTypes.object
};
export default Editor;
