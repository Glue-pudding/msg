import React,{Component} from "react";
import "./product.css";
import styles from "./product.less";
import {Modal,Button,Input,Divider,Popconfirm,Form,Icon} from 'antd';
import PageTalle from '../common/pageTable';
import ImageMonitor from '@/modules/common/image/imgMonitor';
import InlineEditor from '@/modules/common/editor/inlineEditor';
const FormItem = Form.Item;
class TopProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productModalVisible:false,
      curPicId:0,
      modulstate:0,
      previewVisible:false,
      visible:false,
      productList:[],
      editData:{}
    };
  }
  componentWillReceiveProps(props){
    console.log(props.list);
    this.setState({
      productList:props.list
    })
  }
  //弹出模态框
  onEdit=()=>{
    this.setState({
      productModalVisible:true
    });
  }
  //模态框取消和关闭
  handleCancel=()=>{
    this.setState({productModalVisible:false,modulstate:0});
  }
  // 新增
  handleAdd(){
    this.setState({
      editData:{},
      modulstate:1
    })
  }
   //点击编辑
   editRowData(rowData) {
    console.log(rowData);
    this.setState({
      editData:rowData,
      modulstate:1
    }) 
  }
  //输入验证
  checkText=(rule,value,callback)=>{
    let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

    if(regEn.test(value) || regCn.test(value)) {
        callback("不能包含特殊字符.");
    }else{
        callback();
    }
  }
  //弹出图片库
  onEditpic = (id,name) => {
    this.setState({
      visible:true,
      productModalVisible:false ,    
    });
  }
  //取消图片库的选择
  cancelImg=()=>{
    this.setState({visible:false,productModalVisible:true});
  }
  // 删除产品列表
  delRowData(rowData) {
    const {deleteProductList}=this.props.actions;
    deleteProductList(rowData.id);
  }
  // 产品列表文字可编辑
  productTitle=(data)=>{
    console.log(data);
    const {changeProductListTitle} = this.props.actions;
    changeProductListTitle(data);
  }
  // 图片库选定之后的操作
  submitImg=(id)=>{
    const {imgs}=this.props;
    let iobj=JSON.parse(JSON.stringify(this.state.editData));
    imgs.filter((cItem)=>{if(cItem.id===id){
      iobj.url=cItem.url;
      iobj.imageId=id;
    }});
    this.setState({
      editData:iobj,
      visible:false,
      productModalVisible:true,
      modulstate:1,
    })
  }
  // 返回按钮
  editReturn=()=>{
    this.setState({
      modulstate:0
    })
  }
  //产品列表小于8是点击新增
  pageAdd=()=>{
    this.setState({
      productModalVisible:true,
      modulstate:1,
      editData:{}
    })
  }
  //新增或提交
  handleOkSave=()=>{
    const {addAndEdit}=this.props.actions;
    let formdata;
    this.props.form.validateFields((err, values) => {
      console.log(values);
      if(this.state.oneId){
         formdata={
          productId:this.state.oneId,
          productName:values.name,
          imageId:values.imageId
         }
      }else{
        formdata={
          productName:values.name,
          imageId:values.imageId
        }
      }
      console.log(formdata);
      addAndEdit(formdata);
    });
  }
  //点击确定提交排序之后的列表
  handleOk=()=>{
    const {productList}=this.state;
    const {productSort}=this.props.actions;
    productSort(productList);
  }
  addProduct=()=>{
    const { getFieldDecorator } = this.props.form;
    const {editData}=this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus-square'}/>
      </div>
    );
    return(
      <div>
        <FormItem {...formItemLayout} hasFeedback label="产品名称">
            {getFieldDecorator("name", {
              rules: [
                {required: true,message: "产品名称不能为空"},
                {validator:this.checkText}
              ],
              initialValue:editData.name
            })(<Input placeholder="请输入产品名称" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="产品图片"
            extra={<div>图片要求：png 或 jpg格式 / 320 x 240 (px) / 1M 以下</div>}
          >
            <div className={styles.dropbox} class="hoverable" style={{overflow:'hidden',display:'inline-block'}}>
            <i class="editCoin" onClick={this.onEditpic}></i>
                {getFieldDecorator('imageId', {
                    rules: [
                        { required: true,message: "请上传图片" },
                    ],
                    initialValue:editData.imageId
                })(
                    editData.imageId?<div className='bannerDetailBox hoverable'>
                      <i class="editCoin" onClick={this.onEditpic}></i> 
                      <img src={editData.url} alt='banner 图'/>
                    </div>:<div className='bannerDetailBox' onClick={this.onEditpic} style={{cursor:'pointer'}}><Icon type="plus" /></div>
                )}
            </div>
            </FormItem>
      </div>
    )
  }
  //排序
  sortMenu=(index,type)=>{
    const {productList}=this.state;
    let curProduct = productList;
    // this.props.actions.sortMenu(index,type);
    
    let tag = type==='up'?index-1:index+1;
    let curItem = curProduct.splice(index,1);
    curProduct.splice(tag,0,curItem[0]);
    this.setState({productList:curProduct});
}
  proList=()=>{
    const t = this;
    const {productList}=t.state;
    const {list,imgs}=this.props;
    
    productList.map((item,ide)=>{
      imgs.filter((pitem,index)=>{
        if(pitem.id==productList[ide]['imageId']){
          productList[ide].url=pitem.url;
          return false
        }
      })
    })
    let len=productList.length-1;
    let menuColumns = [
        {title:'产品图片',dataIndex:'url',key:'url',
          render: (text, record) => {
            return (
              <div>
                <img
                  className="tableImg"
                  src={text}
                  alt="wrappixel kit"
                />
              </div>
            );
          }
        },
        {title:'产品名称',dataIndex:'name',key:'name',
          render: (text,record) => {
            return (
              <div>
                {text}
              </div>
            )
          }
        },
        {title:'排序',dataIndex:'sort',key:'sort',
          render:(r,k,index)=>{
            return <div style={{fontSize:"20px",color:'#007BFF'}}>
                {index===0?null:<a href="javascript:void(0);" title="上移" onClick={t.sortMenu.bind(t,index,'up')}><Icon type="arrow-up" /></a>}
                {index===len?null:<a href="javascript:void(0);" title="下移" onClick={t.sortMenu.bind(t,index,'down')}><Icon type="arrow-down" /></a>}
            </div>            
          }
        },
        {title:'操作',dataIndex:'content',key:'content',render:(text, record)=>{
            return (
              <div>
                 
                    <span>
                      <a onClick={() => t.editRowData(record)}>编辑</a>
                      <Divider type="vertical" style={{margin:'0 5px'}}/>
                      <Popconfirm title="是否删除" onConfirm={() => t.delRowData(record)}>
                        <a href="javascript:;">删除</a>
                      </Popconfirm>
                    </span>
              </div>
            );
        }}
    ]
    return (
      <div>
      <Button onClick={this.handleAdd.bind(this)} type="primary" style={{ marginBottom: 8 }}>
         新增产品
      </Button>
      <PageTalle
          // loading={this.state.loading} 
          columns={menuColumns} 
          // list={dataList}
          list={productList|| []}
          loadList={this.loadData}
        />
      {/* <Table columns={menuColumns} dataSource={news} pagination={false} rowKey="id"></Table> */}
      </div>
    )
  }
  render(){
    const t=this;
    const {modulstate,productList}=this.state;
    console.log(productList);
    const {list,imgs,productTitle}=this.props;
    let proNew=[];
    if(productList){
       proNew=productList
    }else{
      proNew=list
    }
    console.log(proNew);
    proNew.map((item,ide)=>{
      imgs.filter((pitem,index)=>{
        if(pitem.id==proNew[ide]['imageId']){
          proNew[ide].url=pitem.url;
          return false
        }
      })
    })

    console.log(proNew);
    return (
      <div className="listBox bg-light ptr5 pbr6">
        <div class="spacer">
          <div class="container">
            <div class="row justify-content-center mb-4">
              <div class="col-md-7 text-center">
                <h2 class="title">
                  <InlineEditor config={{text:productTitle,id:"productListTitle1"}} getValue={this.productTitle} />
                </h2>
              </div>
            </div>
            <div class="row hoverable" >
            <i class="editCoin" onClick={this.onEdit}></i>

              {
                proNew.map((item,index)=>{
                  return(
                    <div class="col-md-3 wrap-list-box" key={item.id}>
                      <div
                        class="text-center"
                        data-aos="flip-left"
                        data-aos-duration="1200"
                      >
                        <img
                          class=" img-responsive mb-2"
                          src={item.url}
                          alt="wrappixel kit"
                        />
                        <div class="list-info">
                          <h5 class="font-medium">{item.name}</h5>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
              {
                proNew.length<8?<div class="col-md-3 wrap-list-box" style={{marginBottom:5,marginTop:10}}><div style={{background:'#eee',textAlign:'center',opacity:0.5}}>
                <Icon onClick={this.pageAdd} type={this.state.loading ? 'loading' : 'plus-square'} style={{fontSize:100,color:'#ccc',margin:40}}/>
              </div></div>:null
              }
            </div>
          </div>
        </div>
        <Modal
          title={modulstate===0?"产品管理":(modulstate===1?<div><Icon style={{color:'#328DFF'}} type="enter" onClick={this.editReturn}/>新增产品</div>:"选择图片")}
          visible={this.state.productModalVisible}
          onCancel={this.handleCancel}
          width="700px"
          footer={
            modulstate===0?[
              <Button key="back" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              确定
            </Button>
            ]:[
              <Button key="back" onClick={this.editReturn}>返回</Button>,
            <Button key="submit" type="primary" onClick={this.handleOkSave}>
              保存
            </Button>
            ]
          }
        >
        {modulstate===0?this.proList():this.addProduct()
        }
        </Modal>
        <ImageMonitor visible={this.state.visible} cancelImg={this.cancelImg} id={t.state.editData.imageId} submitImg={this.submitImg}/>
      </div>
    );
  }
}
export default Form.create()(TopProduct);
