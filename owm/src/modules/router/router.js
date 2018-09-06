import {Switch, Route, Link } from 'react-router-dom';
import React from "react";
import { render } from "react-dom";

import Home from '@/modules/home/home';
import About from '@/modules/about/about';
import Product from '@/modules/product/product';
import News from '@/modules/news/news';
import Connect from '@/modules/connect/connectContainer';
import NewsDetail from '@/modules/news/newsDetail';
class RouterIndex extends React.Component{
    enter=(prev,next)=>{
        console.log(prev,next);
    }
    render(){
        return <Switch >
            <Route exact path="/" component={Home}/>
            <Route path="/home" component={Home} />
            <Route path="/about" component={About}/>
            <Route path="/product" component={Product}/>
            <Route path="/newsDetail/:id" component={NewsDetail}/>
            
            {/* <Route path="/news/detail/:id" component={NewsDetail}/> */}
            <Route path="/news" component={News}/>
            <Route path="/connect" component={Connect}/>
        </Switch>
    }
}

export default RouterIndex;