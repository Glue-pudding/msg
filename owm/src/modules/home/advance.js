import React from "react";
import './home.css';
import styles from './advance.less';
import ImageMonitor from '@/modules/common/image/imgMonitor';
import InlineEditor from '@/modules/common/editor/inlineEditor';
class Advance extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            curObj:props.infor,
            picVisible:false,
            curPicId:null,
            curIndex:0
        };
    }
    componentWillReceiveProps(props){
        this.setState({curObj:props.infor});
    }
    getData=(flag,name,data)=>{
        const {curIndex} = this.state;
        let iObj = JSON.parse(JSON.stringify(this.state.curObj));
        let curItem=null,iFlag=flag||curIndex;
        iObj.list.filter((item,index)=>{
            if(iFlag===index){
                curItem =item;
            }
        });
        curItem[name] = data;
        iObj.list.splice(curIndex,1,curItem);
        this.props.changeAdvance('list',iObj.list);
    }
    getName=(name,value)=>{
        this.props.changeAdvance(name,value);
    }
    submitImg=(id)=>{
        // this.props.changeAdvance('picId',id);
        this.getData(0,'icon',id);
        this.setState({picVisible:false});
    }
    onEditpic=(id,index)=>this.setState({picVisible:true,curPicId:id,curIndex:index})
    cancelImg=()=>this.setState({picVisible:false})
    render(){
        const {curObj,picVisible,curPicId} =this.state;
        const {imgs} = this.props;
        let t=this;
        return <div className={`${styles.advance_box} bg-light pbr5 `}>
            <div class="spacer advance">
                <div class="container">
                    <div class="row justify-content-center mb-5">
                        <div class="col-md-7 text-center">
                            <h2 class="title"><InlineEditor config={{text:curObj.title,id:`advanceTitle`}} getValue={this.getName.bind(this,"title")}/></h2>
                            <h6 class="subtitle"><InlineEditor config={{text:curObj.desc,id:`advanceDescript`}} getValue={this.getName.bind(this,"desc")}/></h6>
                        </div>
                    </div>
                    <div class="row">
                        {curObj&&imgs.length&&curObj.list.map((item,index)=>{
                            let curUrl = "";
                            imgs.filter((cItem,index)=>{
                                if(cItem.id===item.icon){
                                    curUrl = cItem.url;
                                }
                            })
                            return <div class="col-md-6 wrap-feature3-box" key={index}>
                                <div class="card card_shadow" data-aos="fade-right" data-aos-duration="1200">
                                    <div class="card-body d-flex">
                                        <div className={`icon-space align-self-center hoverable ${styles.imgBox}`}>
                                            <i class="editCoin" onClick={t.onEditpic.bind(t,item.icon,index)}></i> 
                                            <img src={curUrl} alt={curUrl} />
                                        </div>
                                        <div class="align-self-center ml-md-4">
                                            <h5 class="font-medium"><InlineEditor config={{text:item.name,id:`${index}advanceNameTitle`}} getValue={this.getData.bind(this,index,"name")}/></h5>
                                            <div class="cardText"><InlineEditor config={{text:item.content,id:`${index}advanceContent`}} getValue={this.getData.bind(this,index,"content")}/></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                        
                    </div>
                </div>
                
            <ImageMonitor visible={picVisible} cancelImg={this.cancelImg} id={curPicId} submitImg={this.submitImg}/>
        </div>
    </div> 
    }
}
export default Advance;