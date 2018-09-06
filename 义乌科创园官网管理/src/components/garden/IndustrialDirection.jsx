/**
 * authored on 2017/4/15.
 */
import React, { Component } from "react";
import { Row, Col, Card ,message} from "antd";
import BreadcrumbCustom from "../BreadcrumbCustom";
import ConStyle from "./EditCard";

import API from "@/mock";

import { get, post } from "../../axios/tools";
import styles from "./Banner.module.less";

class BannerInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      page: 1,
      pageSize: 5,
      loading: false,iconLoading: false,
      YeditType: false,
      edit_email: false,
      edit_phone: false,
      edit_address: false,
      email: "email",
      phone: "电话",
      address: "地址",
      data: []
    };
  }

  componentDidMount() {
    // const { fetchData } = this.props;
    // fetchData({funcName: 'getNewsList', stateName: 'check'});
    let t = this;
    t.loadData();
  }
  conversionDate(date) {
    let time = new Date(date),
      year = time.getFullYear(),
      month = time.getMonth() + 1,
      day = time.getDate();
    return (
      year +
      "-" +
      (month > 9 ? month : "0" + month) +
      "-" +
      (day > 9 ? day : "0" + day)
    );
  }
  loadData() {
    let t = this;
    t.setState({ loading: true });
    let params = { url: API.API_INDUSTRY_LIST };
    post(params).then(function(res) {
      console.log(res);
      if (res && res.code === 10000) {
        t.setState({
          data: res.data.list
        });
      }
    }).catch = err => {
      t.setState({ loading: false, editType: "" });
      console.log("==error==", err);
    };
  }
  saveData(type) {
    let inputData = {};
    if (type === "email") {
      console.log(this.state.email);
    }
    if (type === "phone") {
      inputData = "";
    }
    if (type === "address") {
      inputData = "";
    }
  }
  mail = e => {
    let value = e.target.value;
    console.log(value);
    this.setState({ email: value });
  };
  phone = e => {
    let value = e.target.value;
    this.setState({ phone: value });
  };
  address = e => {
    let value = e.target.value;
    this.setState({ address: value });
  };

  renderConfirm(title) {
    if (title === "email") {
      return (
        <div className={styles.confirmBox}>
          <div
            className={styles.cancel}
            onClick={() => this.setState({ edit_email: false })}
          >
            取消
          </div>
          <div
            className={styles.save}
            onClick={() => {
              this.saveData("email");
            }}
          >
            保存
          </div>
        </div>
      );
    }
    if (title === "phone") {
      return (
        <div className={styles.confirmBox}>
          <div
            className={styles.cancel}
            onClick={() => this.setState({ edit_phone: false })}
          >
            取消
          </div>
          <div
            className={styles.save}
            onClick={() => {
              this.saveData("email");
            }}
          >
            保存
          </div>
        </div>
      );
    }
    if (title === "address") {
      return (
        <div className={styles.confirmBox}>
          <div
            className={styles.cancel}
            onClick={() => this.setState({ edit_address: false })}
          >
            取消
          </div>
          <div
            className={styles.save}
            onClick={() => {
              this.saveData("email");
            }}
          >
            保存
          </div>
        </div>
      );
    }
    return null;
  }
  delIndustry=(id)=>{
    let t=this,params = { url: API.API_INDUSTRY_DELETE,data:{industryId:id} };
    post(params).then(function(res) {
      if (res && res.code === 10000) {
        message.success('操作成功');
        t.loadData();
      }else{
        message.warn((res&&res.message)||"请求出错，请联系管理员！")
      }
    }).catch = err => {
      console.log("==error==", err);
    };
  }
  render() {
    const { data } = this.state;

    return (
      <div>
        <div className={styles.topPanel}>
          {this.state.editType ? (
            this.state.editType === "add" ? (
              <BreadcrumbCustom
                first="人才展示管理"
                second="园区服务管理"
                third="园区产业方向"
              />
            ) : (
              <BreadcrumbCustom
                first="人才展示管理"
                second="园区服务管理"
                third="园区产业方向"
              />
            )
          ) : (
            <BreadcrumbCustom first="园区服务管理" second="园区产业方向" />
          )}
          <h3>
            {this.state.editType
              ? this.state.editType === "add"
                ? "Banner位"
                : "新建Banner"
              : "园区产业方向"}
          </h3>
        </div>
        <div style={{ margin: "8px 28px" }}>
          <Row type="flex" justify="start" gutter={32}>
            <Col md={8}>
              <div className="gutter-box">
                <Card style={{}}>
                  <p
                    className={styles.YNewz}
                    onClick={() => {
                      data.unshift({
                        name: "",
                        modifyTime: "1524619896000",
                        canEdit: true,
                        disabled: false
                      });
                      this.setState({ data });
                    }}
                  >
                    +新增园区产业方向
                  </p>
                </Card>
              </div>
            </Col>
                {data && data.map((item) => {
                    return (<Col md={8} key={item.id}>
                        <div className="gutter-box" key={item.id}>
                            {
                                <ConStyle
                                    // title={item.name}
                                    description={item.modifyTime}
                                    InputValue={item.name}
                                    url={item.url}
                                    delCard={this.delIndustry.bind(this, item.id)}
                                    loading={this.state.loading}
                                    handleSave={(obj) => { // 点击保存
                                        let t=this;
                                        let data=null;
                                        if(item.id === undefined){
                                            data={name:obj.title,url:obj.url}
                                        }else{
                                            data={name:obj.title,industryId:item.id,url:obj.url}
                                        }
                                        this.setState({ iconLoading: true });
                                        let params = {url:API.API_INDUSTRY_SAVE_OR_UPDAE,data:data};
                                        post(params).then(function(res){
                                            if(res&&res.code===10000){
                                                t.loadData();
                                                this.setState({ iconLoading: false });
                                            }
                                        }).catch=(err)=>{
                                            t.setState({loading:false,editType:""})
                                            console.log("==error==",err)
                                        }
                                    }}
                                    handleCancel={() => {
                                        this.loadData();
                                    }}
                                    canEdit={item.canEdit}
                                    disabled={item.disabled}
                                />
                            };
                    </div>
                  </Col>);
              })}
          </Row>
        </div>
      </div>
    );
  }
}

export default BannerInfor;
