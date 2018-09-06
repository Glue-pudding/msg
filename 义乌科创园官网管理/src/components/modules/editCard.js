/**
 * 卡片组件
 * @argument
 * cover:组件图例
 * title:标题
 * desc：描述
 * @author xutao 2018/04/27
 */
import { Input,Card,Button,Icon} from 'antd';
import React, { Component } from "react";
import PropTypes from "prop-types";
const {Meta} = Card;
class EditCard extends Component{
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            editTable:false
        };
    }
    onEdit=()=>this.setState({editTable:true})
    cancelEdit=()=>this.setState({editTable:false})
    onSave=()=>{
        this.props.saveCard(this.props.id,this.props.desc);
    }
    render(){
        let t=this,state=t.state;
        let actCont = state.editTable?[<a onClick={this.cancelEdit} href="javascript:;">取消</a>, <a onClick={this.onSave} href="javascript:;">保存</a>]
                                    :[<a onClick={this.onEdit} href="javascript:;">编辑</a>]
        const {desc,title,cover} = this.props;
        return <Card
            style={{ width: 300, paddingTop: 30 }}
            cover={<Icon type="setting" />}
            actions={[<span>取消</span>, <a>保存</a>]}
        >
        <Meta
          style={{ textAlign: "center" }}
          title={title||"缺省标题"}
          description={state.editTable?<Input value={desc} placeholder={`请输入${title}`} />:desc}
        />
      </Card>
    }
}
EditCard.propTypes = {
    desc:PropTypes.string.isRequired,
    title:PropTypes.string.isRequired,
    cover: PropTypes.element.isRequired
}
export default EditCard;