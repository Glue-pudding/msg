import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Card, Input, Icon } from 'antd';
import styles from './Banner.module.less'; 
import API from '@/mock';
import {post} from '../../axios/tools';

class ConStyle extends React.Component {
  constructor(props){
		super(props);
		this.state = {
			canEdit: props.canEdit || false,
			canSave: false,
			InputValue: props.InputValue,
			id:this.props.id
		};
		this.priValue = this.props.InputValue;
	}

	componentWillReceiveProps(nextProps) {
		const {InputValue} = nextProps;
		// console.log('99999', InputValue);
	}


	handleSave () {
		let t=this;
		let params = {url:API.API_CONTACT_UPDATE,data:{content:this.state.InputValue,contactId:this.state.id}};
		post(params).then(function(res){
			if(res && res.code===10000){
				// console.log("success");
			}
		}).catch=(err)=>{
			t.setState({loading:false,editType:""})
			console.log("==error==",err)
		}
		
	}

	Edit() {
		const { canEdit } = this.state;
		if (!canEdit) {
			return (
				[
					<div
						onClick={() => {
							const {InputValue} = this.state;
							
							this.setState({
								canEdit: true,
								// InputValue: '',
								InputValue,
								canSave: false,
								canEdit: true
							});
						}}
					>编辑</div>
				]
			);
		}



		return (
			[
				<div
					onClick={() => {
						const {InputValue} = this.state;
						// console.log('取消', this.priValue);
						this.setState({
							canEdit: false,
							InputValue: this.priValue,
							canSave: false
						});
					}}
				>取消</div>,
				<div onClick={() => {
						this.handleSave(); 
						this.setState({
							canEdit: false,
							canSave: true, 
						});
						this.priValue = this.state.InputValue;
					}}
				>
					保存
				</div>
			]
		);
	}

	renderSave() {
		return (
			<div className={styles.Ycard}>
				<Input 
					onChange={(e) => {
						// console.log(e.target);
						this.setState({
							InputValue: e.target.value
						});
					}}
					value={this.state.InputValue}
				/>
		</div>
		);
	}

	renderInput() {
		const {canEdit, InputValue, canSave} = this.state;
		const {description} = this.props;
		if (canEdit || canSave) {
			return (
				<div>
					{
						canSave ? <div className={styles.Ycard}>{InputValue}</div> : this.renderSave()
					}
				</div>
			);
		}

		return (<div className={styles.Ycard}>{InputValue}</div>);
		


	}
	renderInputIcon(){
		const { title } = this.props;
          
			if(title ==="招商电话"){
				return (<Icon type="phone" style={{color: '#BFC4CE', width:20, height:25}} />)
			}else if(title ==="园区地址"){
				return (<Icon type="environment-o" style={{color: '#BFC4CE', width:20, height:25}} />)
			}else if(title ==="电子邮件"){
				return (<Icon type="mail" style={{color: '#BFC4CE', width:20, height:25}} />)
			}else if(title ==="公交线路"){
				return (<Icon type="car" style={{color: '#BFC4CE', width:20, height:25}} />)
			}
	}

	render() {
		const { className, title, description, imgSrc } = this.props;
		return (	
			<Card actions={this.Edit()}>
				<p className={styles.Ycard}>
					
					{this.renderInputIcon()}
				</p>
				<p className={styles.Ycard}>{title}</p>
				{this.renderInput()}
			</Card>
		);
	}
}

ConStyle.propTypes = {
	className: propTypes.string,
	title: propTypes.string,
	// description: propTypes.string,
	imgSrc: propTypes.string,
	handleSave: propTypes.func,
	InputValue: propTypes.string
};

ConStyle.defaultProps = {
	className: '',
	title: '',
	// description: '',
	imgSrc: '',
	handleSave: () => {},
	InputValue: ''
};

export default ConStyle;
