import React from "react";
import { Map, Marker,InfoWindow} from "react-amap";
import {Modal,Form,Input,Button,DatePicker} from "antd";
import CityCascader from '@/modules/common/city/citySelect';
import {get,post} from '@/tools/axios';
import API from '@/tools/api';
const FormItem = Form.Item;
const styleC = {
  background: `url('http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png')`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  width: '30px',
  height: '40px',
  color: '#000',
  textAlign: 'center',
  lineHeight: '40px'
}
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
class Connect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labelVisible:false,
      mapModuleVisible:false,
      company:props.map.company||"",
      longitude:props.map.longitude||120.174534,
      latitude: props.map.latitude||30.270616,
      address:props.map.address||"",
      city:""
    };
  }
  onEdit=()=>{
    this.setState({mapModuleVisible:true});
  }
  toggleVisible=()=>{
    this.setState({labelVisible:!this.state.labelVisible});
  }
  onAddChange = (value, selectedOptions)=>{
    this.setState({city:value})
  }
  searchAddress=()=>{
    const {city,address} =this.state;
    let t=this;
    let params = {
      key:'33ff621ea992f05f782960dc31860a26',
      address:address,city:city.length>1?city[1]:city[0],
      output:'JSON'
    }
    get({url:"https://restapi.amap.com/v3/geocode/geo",params:params}).then((res)=>{
      if(res.geocodes&&res.geocodes.length){
        let location = res.geocodes[0].location;
        t.setState({longitude:location.split(",")[0],latitude:location.split(",")[1],address:res.geocodes[0].formatted_address})
      }
    })
  }
  changeAddress=(e)=>{
    this.setState({address:e.target.value});
  }
  closeMap=()=>{
    const {map} =this.props;
    this.setState({
      mapModuleVisible:false,
      company:map.company||"",
      longitude:map.longitude||120.174534,
      latitude: map.latitude||30.270616,
      address:map.address||"",
    });
  }
  descChange=(e)=>{
    this.setState({company:e.target.value});
  }
  okMap=()=>{
    const {changeMap} =this.props;
    changeMap(this.state);
    this.setState({mapModuleVisible:false});
  }
  render() {
    const {map} =this.props;
    const {labelVisible,longitude,latitude,mapModuleVisible,company,address,city} = this.state;
    const { getFieldDecorator } = this.props.form;
    let center ={longitude,latitude};
    const mapUrl = `https://www.amap.com/search?query=${address}&geoobj=${longitude}%7C${latitude}&zoom=17`;
    const html = `<h6>${company} <a href='${mapUrl}' target='_blank'>详情>></a></h6><div>地址:${address}</div>`;//`<div><h4>Greetings</h4><p>This is content of this info window</p><p>Click 'Change Value' Button:</p></div>`;
    const iMap = <Map amapkey="b3cc5b426696c80cd767f1f8a5ae9bd8" zoom={17} center={center}>
      <Marker position={center} >
          <div style={styleC} onMouseOver={this.toggleVisible} onBlur={this.toggleVisible}></div>
      </Marker>
      <InfoWindow
            position={center}
            visible={labelVisible}
            isCustom={false}
            content={html}
            offset={[10,-10]}
          />
    </Map>
    return (
      <div class="col-lg-12 pbr6 mt-md-5">
        <div class="container hoverable"  style={{ height: "240px" }}>
          <i class="editCoin" onClick={this.onEdit}></i>
          {iMap}
        </div>
        {mapModuleVisible?<Modal visible={mapModuleVisible} title="在线地图编辑" width="768px" onCancel={this.closeMap} onOk={this.okMap}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="所在地址"  {...formItemLayout}>
              <CityCascader style={{width:'30%',marginRight:'16px'}} city={city} cityChange={this.onAddChange.bind(this)} />
              <Input style={{width:'45%',marginRight:'16px'}} value={address} onChange={this.changeAddress}/>
              <Button onClick={this.searchAddress}>搜索</Button>
            </FormItem>
            <FormItem {...formItemLayout} label="标记描述">
              {getFieldDecorator('mark', {
                initialValue:company||"",
                onChange:this.descChange
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="地图预览">
              {getFieldDecorator('map')(
                <div style={{ height: "240px" }}>
                  {iMap}
                </div>
              )}
            </FormItem>
          </Form>
        </Modal>:null}
      </div>
    );
  }
}
export default Form.create()(Connect);
