import {Switch, Route } from 'react-router-dom';
import React from "react";

import Home from "../home/home";
import ProductDetails from "../table/productDetails.jsx";

class RouterIndex extends React.Component{
    render(){
        return <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/app" component={Home}/>
            <Route path="/tab" component={ProductDetails}/>
        </Switch>
    }
}

export default RouterIndex;
