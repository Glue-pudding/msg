import React from "react";
import styles from "./footer.less";
import {connect } from "react-redux";
const Footer=function(props) {
  const {connectState} =props;
  const {infor} = connectState;
  return (
    <footer class="bg-inverse spacer">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 text-center">
            <h4 dangerouslySetInnerHTML={{__html:infor.address['name']}}></h4>
            <span dangerouslySetInnerHTML={{__html:infor.address['value']}}></span>
          </div>
          <div class="col-lg-4 text-center">
            <h4 dangerouslySetInnerHTML={{__html:infor.tel['name']}}></h4>
            <span dangerouslySetInnerHTML={{__html:infor.tel['value']}}></span>
          </div>
          <div class="col-lg-4 ml-auto text-center">
            <h4 dangerouslySetInnerHTML={{__html:infor.mail['name']}}></h4>
            <span dangerouslySetInnerHTML={{__html:infor.mail['value']}}></span>
          </div>
        </div>
      </div>
      <div class={`col-md-12 b-t m-t-40 ${styles.bottombox}`}>
        <div class="container">
          <div class="d-flex">
            <span class="left">
              Copyright 2018. All Rights Reserved by WrapPixel.
            </span>
            <div class="ml-auto right">本站使用<a>浙数文化建站</a>搭建</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
const mapStateToProps=function(state) {
  return {
      connectState: state.connectState
  }
}
export default connect(
  mapStateToProps
)(Footer);
