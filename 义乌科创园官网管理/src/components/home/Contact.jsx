/**
 * authored on 2017/4/15.
 */
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import ConStyle from './ConStyle';
import API from '@/mock';

import {post} from '../../axios/tools';
import styles from './Banner.module.less';


class BannerInfor extends Component{
    constructor(props) {
        super(props);
          this.state = { 
            list:[],page:1,pageSize:5,
            loading:false,
            YeditType:false,
            edit_email: false,
            edit_phone: false,
            edit_address: false,
            email:'email',
            phone:'电话',
			address:'地址',
			data: [],
			id:1,
           };
		}

		turnEdit(title) {
			const state = this.state;
			if (title === 'email') {
				state.edit_email = true;
			}
			if (title === 'phone') {
				state.edit_phone = true;
			}
			if (title === 'address') {
				state.edit_address = true;
			}
			this.setState({
				state
			});
        }
        componentDidMount(){
            // const { fetchData } = this.props;
            // fetchData({funcName: 'getNewsList', stateName: 'check'});
            let t=this;
            t.loadData();
        }
        loadData(){
            let t=this;
            t.setState({loading:true});
            let params = {url:API.API_CONTACT_GET};
            post(params).then(function(res){
                if(res && res.code===10000){
                    // console.log(res);
					// t.setState({email:res.data[2].content || '无',phone:res.data[0].content || '无',address:res.data[1].content || '无'});
					t.setState({
						data: res.data,
						id:res.data.id
					});
                }
            }).catch=(err)=>{
                t.setState({loading:false,editType:""})
                console.log("==error==",err)
            }
		}


        saveData(type){
            let inputData = {};
            if(type === 'email') {
                // console.log(this.state.email);
            }
            if(type === 'phone') {
                inputData='';
            }
            if(type === 'address') {
                inputData='';
			}
			

		}
		
        mail=(e)=>{
            let value = e.target.value;
            // console.log(value);
            this.setState({email: value})
        };
        phone=(e)=>{
            let value = e.target.value;
            this.setState({phone: value})
        
        };
        address=(e)=>{
            let value = e.target.value;
            this.setState({address: value})
        };
		
		renderConfirm(title) {
			if (title === 'email') {
				return (
					<div className={styles.confirmBox}>
						<div className={styles.cancel} onClick={() => this.setState({edit_email:false})}>取消</div>
						<div className={styles.save} onClick={() => { this.saveData('email')}}>保存</div>
					</div>
				);
			}
			if (title === 'phone') {
				return (
					<div className={styles.confirmBox}>
						<div className={styles.cancel} onClick={() => this.setState({edit_phone:false})}>取消</div>
						<div className={styles.save} onClick={() => { this.saveData('email')}}>保存</div>
					</div>
				);
			}
			if (title === 'address') {
				return (
					<div className={styles.confirmBox}>
						<div className={styles.cancel} onClick={() => this.setState({edit_address:false})}>取消</div>
						<div className={styles.save} onClick={() => { this.saveData('email')}}>保存</div>
					</div>
				);
			}
			return null;
		}	


    render(){
			const {data} = this.state;
        return (
					<div>
							<div className={styles.topPanel}>
									{this.state.editType?this.state.editType==="add"?<BreadcrumbCustom first="人才展示管理" second="首页管理" third="Banner位" />:
													<BreadcrumbCustom first="人才展示管理" second="首页管理" third="Banner位" />
									:<BreadcrumbCustom first="首页管理" second="联系方式" />}
									<h3>{this.state.editType?this.state.editType==="add"?"Banner位":"新建Banner":"联系方式"}</h3>
							</div>
							<div style={{margin:'8px 28px'}}>
								<Row type="flex" justify="start" gutter={32}>
								{
									data && data.map((item) => {
										return(<Col md={8}>
											<div className="gutter-box">
												{
													<ConStyle
														title={item.title}
														description={item.content}
														InputValue={item.content || '无'}
														// handleSave={this.handleSave.bind(this,item.id,)}
														canEdit={item.canEdit}
														id={item.id}
														key={item.id}
														onChange={(e) => {
															this.setState({
																content: e.target.value
															});
														}
													}
													/> 
												}
											</div>
										</Col>);
									})
								}
								</Row>
							</div>
					</div>
        )
    }
}

export default BannerInfor;