import React from "react";
import styles from './header.css';
import {Modal} from 'antd';
import ImageMonitor from '@/modules/common/image/imgMonitor';
import InlineEditor from '@/modules/common/editor/inlineEditor';
class TopBg extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            pic:props.img,
            imgUrl:''
        };
    }
    componentDidMount(){
        const {imgs,imgID} = this.props;
        let curUrl = '';
        imgs.filter((item,index)=>{
            if(item.id === imgID){
                curUrl = item.url;
            }
        })
        this.setState({imgUrl:curUrl});
    }
    componentWillReceiveProps(props){
        const {imgs,imgID} = props;
        let curUrl = '';
        imgs.filter((item,index)=>{
            if(item.id === imgID){
                curUrl = item.url;
            }
        })
        this.setState({imgUrl:curUrl});
    }
    getTitle=(data)=>{
        this.props.setBGTitle(data);
    }
    onEdit = ()=>{
        this.setState({visible:true});
    }
    onClose=()=>this.setState({visible:false})
    onSubmit=(id)=>{
        this.props.setBGImg(id);
        this.onClose();
    }
    render(){
        const {text,imgID} = this.props;
        // let imgUrl = img||"http://placehold.it/3608x366";
        let time = new Date();
        return (
            <div class="topbg hoverable" style={{backgroundImage: `url(${this.state.imgUrl})`}}>
                <i class="editCoin" onClick={this.onEdit}></i>
                <div class="container">
                    <h2><InlineEditor config={{id:`${time.getTime()}Topbg`,text}} getValue={this.getTitle.bind(this)} /></h2>
                </div>
                {/* <Modal title="选择图片" visible={this.state.visible} onCancel={this.onClose} onOk={this.onSubmit}>
                    <h3>内容待定</h3>
                </Modal> */}
                
                <ImageMonitor visible={this.state.visible} cancelImg={this.onClose} id={imgID} submitImg={this.onSubmit}/>
            </div>
        );
    }
}
export default TopBg;
