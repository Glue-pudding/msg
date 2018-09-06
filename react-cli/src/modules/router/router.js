import {Switch, Route, Link } from 'react-router-dom';
import React from "react";
import { render } from "react-dom";

import Home from "../home/home";
import Table from "../table/table";

class RouterIndex extends React.Component{
    render(){
        return <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/app" component={Home}/>
            <Route path="/tab" component={Table}/>
        </Switch>
    }
}

export default RouterIndex;
