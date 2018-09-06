import React from "react";
import './header.css'
import {Link } from 'react-router-dom';
import {Modal,Table,Switch,Row,Col,Button,Icon,Input,Divider} from 'antd';
import {connect } from "react-redux";
import { bindActionCreators } from 'redux'
import CommonAction from './commonAction';
import ImageMonitor from './image/imgMonitor';
import EditLogo from './editLogo';
class Header extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            titleEdit:false,
            menuEdit:false,
            activeKey:props.commonState['selectedMenuKey'],
            menuModalVisible:false,
            menuList:JSON.parse(JSON.stringify(props.commonState['menu'])),
            menuLogoVisible:false
        };
    }
    componentDidMount(){
        const {loadMenuList,loadImgList,changeMenu}=this.props.actions;
        let path = window.location.pathname==="/"?"home":window.location.pathname;
        this.setState({activeKey:path});
        changeMenu(path);
        // loadMenuList();
        loadImgList();
    }
    componentWillReceiveProps(props){
        let path = window.location.pathname==="/"?"home":window.location.pathname;
        this.setState({activeKey:path,menuList:props.commonState['menu']});
    }
    onEdit=()=>{
        this.setState({menuModalVisible:true});
    }
    menuClick=(e)=>{
        let key=e.currentTarget.getAttribute("href");
        this.setState({activeKey:key});
        this.props.actions.changeMenu(key);
    }
    renderMenu=()=>{
        const {commonState}=this.props;
        const {menu} = commonState;
        let curKey = this.state.activeKey,t=this;
        return menu.map((item,index)=>{
            let clsName = curKey.match(item.route)?'nav-item active':'nav-item';
            return item.isView?<li className={clsName} key={item.id} title={item.name} >
                <Link to={'/'+item.route} className="nav-link" onClick={t.menuClick}>{item.name}</Link>
            </li>:null;
        })
    }
    menuOk=()=>{
        let menuList = JSON.parse(JSON.stringify(this.state.menuList));
        this.props.actions.submitMenu(menuList);
        let iArr = menuList.filter((item,index)=>{if(item.isView){return item;}})
        if(iArr.length<5){
            this.props.history.push('/home');
        }
        this.menuClose();
    }
    menuClose=()=>{
        const {menu} = this.props.commonState;
        menu.map((item,index)=>{item['edit']=false; return item;});
        this.setState({menuModalVisible:false,menuList:menu});
    }
    viewChange=(index,checked)=>{
        let curMenu = JSON.parse(JSON.stringify(this.state.menuList));
        curMenu[index]['isView'] = checked;
        this.setState({menuList:curMenu});
    }
    sortMenu=(index,type)=>{
        let curMenu = JSON.parse(JSON.stringify(this.state.menuList));
        // this.props.actions.sortMenu(index,type);
        
        let tag = type==='up'?index-1:index+1;
        let curItem = curMenu.splice(index,1);
        curMenu.splice(tag,0,curItem[0]);
        this.setState({menuList:curMenu});
    }
    editMenu=(index)=>{
        let curMenu = JSON.parse(JSON.stringify(this.state.menuList));
        curMenu[index]["edit"] =true;
        curMenu[index]['oldName'] = curMenu[index]['name'];
        this.setState({menuList:curMenu});
    }
    saveItem=(index)=>{
        let curMenu = JSON.parse(JSON.stringify(this.state.menuList));
        curMenu[index]["edit"] =false;
        // curMenu[index]['name'] = curMenu[index]['oldName'] || curMenu[index]['name'];
        this.setState({menuList:curMenu});
    }
    cancelItem=(index)=>{
        let curMenu = JSON.parse(JSON.stringify(this.state.menuList));
        curMenu[index]["edit"] =false;
        curMenu[index]['name'] = curMenu[index]['oldName'] ||curMenu[index]['name'];
        this.setState({menuList:curMenu});
    }
    nameChange=(index,e)=>{
        let value = e.target.value,
            curMenu = JSON.parse(JSON.stringify(this.state.menuList));
        if(value.length>10){
            value = value.slice(0,10);
        }
        curMenu[index]['name'] = value;
        this.setState({menuList:curMenu});
    }
    getMenuColumns=()=>{
        const {menuList} = this.state;
        let t=this,len=menuList.length-1;;
        return [
            {title:'导航名称',dataIndex:'name',key:'name',width:220,render:(r,k,index)=>{
                return k.edit?<Input value={r} onChange={t.nameChange.bind(t,index)}/>:<div title={r} className="menuName" >{r}</div>
            }},
            {title:'是否可见',dataIndex:'isView',key:'isView',render:(r,k,index)=>{
                if(!k.isEditView){
                    return <span> - </span>
                }else{
                    return <Switch checked={r?true:false} onChange={t.viewChange.bind(t,index)}/>
                }
            }},
            {title:'排序',dataIndex:'sort',key:'sort',render:(r,k,index)=>{
                if(!index){
                    return <span> - </span>
                }else{
                    return <div style={{fontSize:"20px",color:'#007BFF'}}>
                        {index===1?null:<a href="javascript:void(0);" title="上移" onClick={t.sortMenu.bind(t,index,'up')}><Icon type="arrow-up" /></a>}
                        {index===len?null:<a href="javascript:void(0);" title="下移" onClick={t.sortMenu.bind(t,index,'down')}><Icon type="arrow-down" /></a>}
                    </div>
                }
            }},
            {title:'操作',dataIndex:'operate',key:'operate',render:(r,k,index)=>{
                if(!k.edit){
                    return <a href="javascript:void(0);" onClick={t.editMenu.bind(t,index)}>编辑</a>
                }else{
                    return <div>
                        <a href="javascript:void(0);" onClick={t.saveItem.bind(t,index)}>保存</a>
                        <Divider type='vertical'/>
                        <a href="javascript:void(0);" onClick={t.cancelItem.bind(t,index)}>取消</a>
                    </div>
                }
            }}
        ];
    }
    editLogo=()=>{
        this.setState({menuLogoVisible:true});
    }
    cancelLogo=()=>{
        this.setState({menuLogoVisible:false});
    }
    submitLogo=(type,imgId,text)=>{
        this.props.actions.changeLogo(type,imgId,text);
        this.cancelLogo();
    }
    submitImg=(id)=>{
        console.log('===img id===',id)
    }
    render(){
        const {commonState,actions}=this.props;
        const {menuList,menuLogoVisible} = this.state;
        const {logo,imgList} =commonState;
        let t=this,curLogourl = '';
        imgList.filter((item,index)=>{if(item.id===logo.imgID){curLogourl=item.url;}});
        let logoCont = logo.type==='img'?<img src={curLogourl} alt="logo" />:<span dangerouslySetInnerHTML={{__html: logo.word}}></span>
        return (
            <header className="fixed-top bg-white h1-nav">
                <Row className='editPanel'>
                    <div className="container">
                        <Col span={6}>
                            <a className="mr-md-5">网站管理</a>
                            <a>更换模板</a>
                        </Col>
                        <Col span={8} offset={10} className="textAlignRight">
                            <Button className="mr-md-3" type="primary" onClick={actions.saveData}>保存</Button>
                            <Button className="mr-md-3"><Link to="/preview">预览</Link></Button>
                            <Button>取消</Button>
                        </Col>
                    </div>
                </Row>
                <nav className="container navbar navbar-expand-md">
                    <div><a className="navbar-brand hoverable" href="javascript:void(0);" onClick={t.editLogo} ><i className="editCoin"></i>{logoCont}</a></div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="navbar-nav ml-auto mt-2 mt-lg-0 hoverable">
                            <i className="editCoin" onClick={this.onEdit}></i>
                            {this.renderMenu()}
                        </ul>
                    </div>
                </nav>
                <Modal visible={this.state.menuModalVisible} title="导航管理" maskClosable={false} onOk={this.menuOk.bind(this)} onCancel={this.menuClose} width="568px" >
                    <Table columns={this.getMenuColumns()} dataSource={menuList} pagination={false} rowKey="id"></Table>
                </Modal>
                {menuLogoVisible?<EditLogo visible={menuLogoVisible} submitLogo={this.submitLogo} cancelLogo={this.cancelLogo} type={logo.type} imgs={imgList} logoObj={logo} />:null}
                {/* <ImageMonitor visible={menuLogoVisible} cancelImg={this.cancelImg} id={logo.imgID} submitImg={this.submitImg}/> */}
            </header>
        );
    }
}
const mapStateToProps=function(state) {
    return {
        commonState: state.commonState
    }
  }
  
const mapDispatchToProps=(dispatch)=> {
    return {
        actions:bindActionCreators(CommonAction, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
