/**
 * Created by author on 2017/8/13.
 */
import React, { Component } from 'react';
// import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import Banner from '../components/home/Banner';         //首页管理-Banner
import Contact from '../components/home/Contact';       //首页管理-联系人信息
import NewsInfor from '../components/news/NewsManage';         
import CompanyInfor from '../components/company/CompanyInfor';            
import CompanyType from '../components/company/CompanyType';        
import PersonInfor from '../components/person/Person'; 

import GardenIntro from '../components/garden/GardenIntro';
import IndustrialDirection from '../components/garden/IndustrialDirection';
import PolicyServices from '../components/garden/PolicyServices';
import SupportingFacilities from '../components/garden/SupportingFacilities';

// import DataReport from '../components/report/DataReport';               
// const WysiwygBundle = (props) => (
//     <Bundle load={Wysiwyg}>
//         {(Component) => <Component {...props} />}
//     </Bundle>
// );

export default class CRouter extends Component {
    requireAuth = (permission, component) => {
        const { auth } = this.props;
        const { permissions } = auth.data;
        // const { auth } = store.getState().httpData;
        if (!permissions || !permissions.includes(permission)) return <Redirect to={'404'} />;
        return component;
    };
    render() {
        return (
            <Switch>
                {/* Banner位 */}
                <Route exact path="/app/home/banner" component={Banner} />  
                {/* 联系方式 */}
                <Route exact path="/app/home/contact" component={Contact} />
                {/* 新闻管理 */}
                <Route exact path="/app/news/manage" component={NewsInfor} />
                {/* 入驻企业 */}
                <Route exact path="/app/company/infor" component={CompanyInfor} />
                {/* 企业类型 */}
                <Route exact path="/app/company/type" component={CompanyType} />
                {/* 人才展示管理 */}
                <Route path="/app/person/infor" component={PersonInfor} />
                {/* 园区简介 */}
                <Route exact path="/app/garden/GardenIntro" component={GardenIntro} />
                {/* 园区产业方向 */}
                <Route exact path="/app/garden/IndustrialDirection" component={IndustrialDirection} />
                {/* 政策服务 */}
                <Route exact path="/app/garden/PolicyServices" component={PolicyServices} />
                {/* 配套设施 */}
                <Route exact path="/app/garden/SupportingFacilities" component={SupportingFacilities} />            

                <Route render={() => <Redirect to="/404" />} />
            </Switch>
        )
    }
}