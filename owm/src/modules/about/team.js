import React,{Component} from "react";
import InlineEditor from '@/modules/common/editor/inlineEditor';
import ImageMonitor from '@/modules/common/image/imgMonitor';
import styles from './about.css';
export default class Team extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            curPicId:0,
            curPicName:''
        };
    }
    getData=(type,tag,data)=>{
        const {changeAboutTeam}=this.props.actions;
        changeAboutTeam(type,tag,data);
    }
    onEditpic=(id,name)=>{
        this.setState({visible:true,curPicId:id,curPicName:name});
    }
    cancelImg=()=>{
        this.setState({visible:false});
    }
    submitImg=(id)=>{
        const {curPicName} = this.state;
        const {changePicTeam}=this.props.actions;
        changePicTeam(id,curPicName);
        this.setState({
          visible:false
        })
    }
    getTitle=(data)=>{
        console.log(data);
        const {changeTeamTitle} = this.props.actions;
        changeTeamTitle(data);
    }
    getContent=(data)=>{
        const {changeTeamContent} =this.props.actions;
        changeTeamContent(data);
    }
    render(){
        const {visible,curPicId}=this.state;
        const {actions,imgs,team}=this.props;
        let editorConfig = {
            text:team.teamTitle,
            id:'teamTitle'
        };
        let teamContent = {
            text:team.teamContent,
            id:'teamContent'
        }
        let inforCont = [];
        for(var item in team){
            if(item!=="teamTitle"&&item!=="teamContent"){
                let url = '';
                imgs.filter((pitem,index)=>{
                    if(pitem.id==team[item]['staffPicId']){
                        url=pitem.url;
                        return false;
                    }
                });
                inforCont.push(<div class="col-md-3 wrap-team-box" key={item}>
                    <div class="text-center" data-aos="flip-left" data-aos-duration="1200">
                           <div class="text-center hoverable title">
                             <img src={url} style={{width:'3em',height:'3em',padding:10}} />
                             <i class="editCoin" onClick={this.onEditpic.bind(this,team[item]['staffPicId'],item)}></i>
                           </div>
                           <div class="team-info">
                                <h5 class="font-medium">
                                <InlineEditor config={{text:team[item]['staffName'],id:`${item}StaffName`}} getValue={this.getData.bind(this,item,"staffName")}/>
                                </h5>
                                <div class="m-t-20">
                                <InlineEditor config={{text:team[item]['staffPosition'],id:`${item}StaffPosition`}} getValue={this.getData.bind(this,item,"staffPosition")}/>
                                </div>
                            </div>                    
                    </div>   
                </div>);
            }
            
        }


        return (
            <div className="teamBox pbr5">
                <div class="spacer">
                    <div class="container">
                        <div class="row justify-content-center mb-5">
                            <div class="col-md-7 text-center">
                                <h2 class="title">
                                <InlineEditor config={editorConfig} getValue={this.getTitle} /></h2>
                                <h6 class="subtitle">
                                <InlineEditor config={teamContent} getValue={this.getContent} />
                                </h6>
                            </div>
                        </div>
                        <div class="row">
                            {inforCont}
                        </div>
                    </div>
                </div>
                <ImageMonitor visible={visible} cancelImg={this.cancelImg} id={curPicId} submitImg={this.submitImg}/>
            </div>        
        )
    }
}