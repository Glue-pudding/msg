/**
 * Created by author on 2017/8/13.
 */
import React, { Component } from 'react';
// import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import BasicInfor from '../components/business/BasicInfor';         //企业信息-基本信息
import PersonInfor from '../components/business/PersonInfor';       //企业信息-人才信息
import HouseInfor from '../components/business/HouseInfor';         //企业信息-住宿信息
import CheckInfor from '../components/check/CheckInfor';            //账单信息
import CheckInforDetail from '../components/check/CheckDetail';        //账单信息详情
import MaintainInfor from '../components/maintain/MaintainInfor';       //报修反馈
import MaintainDetail from '../components/maintain/MainTainDetail';     //报修反馈详情

import DataReport from '../components/report/DataReport';               //数据直报

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
                <Route exact path="/app/business/basicInfor" component={BasicInfor} />
                <Route exact path="/app/business/personInfor" component={PersonInfor} />
                <Route exact path="/app/business/houseInfor" component={HouseInfor} />
                <Route exact path="/app/checkInfor/detail" component={CheckInforDetail} />
                <Route exact path="/app/checkInfor" component={CheckInfor} />
                {/* <Route exact path="/app/maintain" component={MaintainInfor} /> */}
                <Route path="/app/maintain/:id" component={MaintainDetail} />
                <Route path="/app/maintain" component={MaintainInfor} />
                <Route exact path="/app/data/report" component={DataReport} />

                <Route render={() => <Redirect to="/404" />} />
            </Switch>
        )
    }
}