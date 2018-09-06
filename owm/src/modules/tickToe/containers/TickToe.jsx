import React from "react";
import Game from "../Game";
import './tick.css';
import {connect } from "react-redux";
import { bindActionCreators } from 'redux'
import TickAction from '../action/tickAction';
class TickToe extends React.Component {
  handleClick=()=>{
    this.props.actions.increaseAction(new Date());
  }
  render() {
    const { tickState, actions } = this.props;
    return (
      <div>
        <Game />
        <button onClick={this.handleClick}>add</button>
        <span>{tickState.count}</span>
      </div>
    );
  }
}
const mapStateToProps=function(state) {
  return {
    tickState: state.tickState
  }
}

const mapDispatchToProps=(dispatch)=> {
  return {
    actions:bindActionCreators(TickAction, dispatch)
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TickToe);


// window.addEventListener('mousedown', function(e) {
//   document.body.classList.add('mouse-navigation');
//   document.body.classList.remove('kbd-navigation');
// });
// window.addEventListener('keydown', function(e) {
//   if (e.keyCode === 9) {
//     document.body.classList.add('kbd-navigation');
//     document.body.classList.remove('mouse-navigation');
//   }
// });
// window.addEventListener('click', function(e) {
//   if (e.target.tagName === 'A' && e.target.getAttribute('href') === '#') {
//     e.preventDefault();
//   }
// });
// window.onerror = function(message, source, line, col, error) {
//   var text = error ? error.stack || error : message + ' (at ' + source + ':' + line + ':' + col + ')';
//   errors.textContent += text + '\n';
//   errors.style.display = '';
// };
// console.error = (function(old) {
//   return function error() {
//     errors.textContent += Array.prototype.slice.call(arguments).join(' ') + '\n';
//     errors.style.display = '';
//     old.apply(this, arguments);
//   }
// })(console.error);