import React from "react";
import CommTab from '@/common/TableComp';
import { Input, Icon, message, Divider, Breadcrumb, Button, Row, Col } from 'antd';
import styles from './home.less';
import { Link } from 'react-router-dom';
import { post } from '@/tools/axios';
const Search = Input.Search;

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: '',loading:false,
      getProductList: [],
      dropdownVisible: false, curType: 'all',
      chooseTime: '', keyId: "1",
    };
  }
  componentDidMount() {
    let t = this;
    t.loadList();
  }
  //拉取列表
  loadList(value) {
    const { keyId } = this.state;
    this.setState({loading: true });
    if (value) {
      post({ url: "/api/report/getProductList", data: { flag: keyId, spec: value } }).then((res) => {
        if (res && res.code === 10000) {
          this.setState({ time: res.lastUpdatedTime, getProductList: res.products,loading: false })
        } else {
          message.warn('系统出错，请联系管理员' || res.info)
        }
      }).catch = (err) => {
        console.log('==error==', err)
      }
    } else {
      post({ url: "/api/report/getProductList", data: { flag: 1 } }).then((res) => {
        if (res && res.code === 10000) {
          this.setState({ time: res.lastUpdatedTime, getProductList: res.products ,loading: false })
        } else {
          message.warn('系统出错，请联系管理员' || res.info)
        }
      }).catch = (err) => {
        console.log('==error==', err)
      }
    }

  }
  //查询搜索
  searchName(value) {
    this.loadList(value);
    this.setState({ spec: value })
  }
  //产品规格筛选
  changeType (type) {
    this.setState({ curType: type, dropdownVisible: false });
    if(type==="all"){
      this.loadList();
    }else{
      post({ url: "/api/report/getProductList", data: { category: type,flag: this.state.keyId, } }).then((res) => {
        if (res && res.code === 10000) {
          this.setState({ time: res.lastUpdatedTime, getProductList: res.products,loading: false  })
        } else {
          message.warn('系统出错，请联系管理员' || res.info)
        }
      }).catch = (err) => {
        console.log('==error==', err)
      }
    }

  }
  //是否置顶
  toggTop(productName, isTop) {
    let isTopset = '';
    if (isTop) { isTopset = false; } else { isTopset = true; }
    let t = this, params = { url: "/api/report/changeTop", data: { productName: productName, isTop: isTopset } }
    t.setState({ loading: true })
    post(params).then(function (res) {
      if (res && res.code === 10000) {
        message.success("操作成功");
        t.setState({ loading: false })
        t.loadList();
      } else {
        message.warn(res.info)
      }
    }).catch = (err) => {
      console.log("==error==", err)
    }
  }
  typeChange(e) {
    let time = e.target.value;
    this.setState({ keyId: time,loading: true })
    post({ url: "/api/report/getProductList", data: { flag: time } }).then((res) => {
      if (res && res.code === 10000) {
        this.setState({ time: res.lastUpdatedTime, getProductList: res.products, chooseTime: time,loading: false  })
      } else {
        message.warn('系统出错，请联系管理员' || res.info)
      }
    }).catch = (err) => {
      console.log('==error==', err)
    }

  }
  render() {
    let t = this;
    const { curType, dropdownVisible, getProductList } = this.state;
    let typeList = [
      { text: '全部', value: 'all' },
      { text: 'DTY', value: 'DTY' },
      { text: 'FDY', value: 'FDY' },
      { text: 'POY', value: 'POY' },
    ];
    const columns = [{
      title: '产品规格',
      dataIndex: 'productName',
      key: 'productName',
      width: '150px',
      filterDropdownVisible: dropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {
        t.setState({ dropdownVisible: visible });
      },
      filterMultiple:true,
      filterDropdown: (
        <div className={styles.dropdownBox}>
          <ul>
            {typeList.map((item, index) => {
              return <li onClick={t.changeType.bind(t, item.value)} key={item.value} className={curType === item.value ? styles.active : ''}>
                <a href="javascript:void(0);">{item.text}</a>
              </li>;
            })}
          </ul>
        </div>
      ),
      render: (text, record, index) => {
        let isTop = record.isTop;
        let proName = record.productName.replace(/(.{3})/, '$1 ');
        return <div className={styles.tabItem} key={record.productName}>
          <p >{isTop ? <label className={styles.topLabel}>置顶</label> : ""}{proName}</p>
        </div>
      },
    }, {
      title: this.state.keyId==="1"?"本日成交价{元/kg}":this.state.keyId==="2"?"昨日成交价{元/kg}":this.state.keyId==="3"?'本月成交价{元/kg}':'上月成交价{元/kg}',
      dataIndex: 'txnPriceToday',
      key: 'txnPriceToday',
      className: 'column-money',
      render: (text, record, index) => {
        return <div>
          {record.txnPriceToday==0 ? '--': '￥' + record.txnPriceToday.toFixed(2)}
        </div>
      }
    }, {
      title: this.state.keyId==="1"?"本日浮动":this.state.keyId==="2"?"昨日浮动":this.state.keyId==="3"?'本月浮动':'上月浮动',
      dataIndex: 'txnPriceChangeToday',
      key: 'txnPriceChangeToday',
      className: 'column-money',
      width: '11%',
      render: (text, record, index) => {
        return <div className={record.txnPriceChangeToday==0 ?null: (record.txnPriceChangeToday > 0 ? styles._up : styles._down)}>
          {record.txnPriceChangeToday==0 ?"--": record.txnPriceChangeToday > 0 ? record.txnPriceChangeToday + '%' : record.txnPriceChangeToday + '%'}{record.txnPriceChangeToday ==0?null: record.txnPriceChangeToday > 0 ?
            <Icon type="caret-up" style={{ marginLeft: '5px' }} /> :
            <Icon type="caret-down" style={{ marginLeft: '5px' }} />}
        </div>
      }
    }, {
      title: this.state.keyId==="1"?"近7日浮动":this.state.keyId==="2"?"近7日浮动":this.state.keyId==="3"?'近3月浮动':'近3月浮动',
      dataIndex: 'txnPriceChangeWeek',
      key: 'txnPriceChangeWeek',
      className: 'column-money',
      width: '11%',
      render: (text, record, index) => {
        return <div className={record.txnPriceChangeWeek ==0? null: record.txnPriceChangeWeek > 0 ? styles._up : styles._down}>
          {record.txnPriceChangeWeek==0 ?'--': record.txnPriceChangeWeek > 0 ? '+' + record.txnPriceChangeWeek + '%' : record.txnPriceChangeWeek + '%'}{record.txnPriceChangeWeek==0 ?null: record.txnPriceChangeWeek > 0 ?
            <Icon type="caret-up" style={{ marginLeft: '10px' }} /> :
            <Icon type="caret-down" style={{ marginLeft: '10px' }} />}
        </div>
      }
    }, {
      title: this.state.keyId==="1"?"本日市场成交均价{元/kg}":this.state.keyId==="2"?"昨日市场成交均价{元/kg}":this.state.keyId==="3"?'本月市场成交均价{元/kg}':'上月市场成交均价{元/kg}',
      dataIndex: 'marketPriceToday',
      key: 'marketPriceToday',
      className: 'column-money',
      render: (text, record, index) => {
        return <div>
          {record.marketPriceToday==0 ?'--': '￥' + record.marketPriceToday.toFixed(2)}
        </div>
      }
    }, {
      title:  this.state.keyId==="1"?"本日浮动":this.state.keyId==="2"?"昨日浮动":this.state.keyId==="3"?'本月浮动':'上月浮动',
      dataIndex: 'marketPriceChangeToday',
      key: 'marketPriceChangeToday',
      className: 'column-money',
      width: '11%',
      render: (text, record, index) => {
        return <div className={record.marketPriceChangeToday==0 ?null: (record.marketPriceChangeToday > 0 ? styles._up : styles._down) }>
          {record.marketPriceChangeToday==0 ?'--': record.marketPriceChangeToday > 0 ? '+' + record.marketPriceChangeToday + '%' : record.marketPriceChangeToday + '%'}{record.marketPriceChangeToday==0 ?null: record.marketPriceChangeToday > 0 ?
            <Icon type="caret-up" style={{ marginLeft: '10px' }} /> :
            <Icon type="caret-down" style={{ marginLeft: '10px' }} /> }
        </div>
      }
    }, {
      title: this.state.keyId==="1"?"近7日浮动":this.state.keyId==="2"?"近7日浮动":this.state.keyId==="3"?'近3月浮动':'近3月浮动',
      dataIndex: 'marketPriceChangeWeek',
      key: 'marketPriceChangeWeek',
      className: 'column-money',
      width: '11%',
      render: (text, record, index) => {
        return <div className={record.marketPriceChangeWeek ? (record.marketPriceChangeWeek > 0 ? styles._up : styles._down) : null}>
          {record.marketPriceChangeWeek==0 ?'--': record.marketPriceChangeWeek > 0 ? '+' + record.marketPriceChangeWeek + '%' : record.marketPriceChangeWeek + '%'}{record.marketPriceChangeWeek==0 ?null: record.marketPriceChangeWeek > 0 ?
            <Icon type="caret-up" style={{ marginLeft: '10px' }} /> :
            <Icon type="caret-down" style={{ marginLeft: '10px' }} /> }
        </div>
      }
    }, {
      title: '操作',
      key: 'action',
      width: '14%',
      render: (text, record) => {
        let isTop = record.isTop, productName = record.productName;
        return <span>
          <Link to={'/tab?name=' + record.productName}>详情</Link>
          <Divider type="vertical" />
          <a onClick={t.toggTop.bind(t, productName, isTop)} className={isTop ? styles.red : ""} >{isTop ? "取消置顶" : "置顶"}</a>
        </span>
      }
    }];
    let arr = [
      { id: "4", name: '上月' },
      { id: "3", name: '本月' },
      { id: "2", name: '昨日' },
      { id: "1", name: '本日' },
    ]
    return (

      <div style={{ padding: "0 136px", marginTop: -70, minHeight: '500px', marginBottom: 42 }}>
        <div className={styles.banner}>
          <span className={styles.nav}>欢迎回来!</span>
          <Breadcrumb style={{ margin: "8px 0 20px 24px" }}>
            <Breadcrumb.Item><Icon type="home" style={{ fontSize: '14px', color: '#4A88FF' }} /></Breadcrumb.Item>
            <Breadcrumb.Item>化工指标报表</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.CardBox}>
          <div>
            <Row>
              <Col span={14} className={styles.newTime}>数据更新于：{this.state.time}</Col>
              <Col span={10} className={styles.Cardbox}>
                <li><Search placeholder="请输入规格" onSearch={this.searchName.bind(this)} style={{ width: 200, float: 'right' ,marginLeft:'16px'}} /></li>
                {arr.map((item, index) => {
                  return <li className={styles.extraTime} key={item.id}>
                    <Button value={item.id} className={item.id === this.state.keyId ? styles.active : ''}
                      onClick={this.typeChange.bind(this)}>
                      {item.name}
                    </Button></li>
                })}

              </Col>
            </Row>
          </div>
          <div style={{ margin: '0 24px' }} className={styles.tabComm}>
            <CommTab list={getProductList} columns={columns} rowKey='productName' loadList={this.loadList} loading={this.state.loading}/>
          </div>
        </div>
      </div>
    );
  }
}
export default Schedule;