import React from "react";
import Square from "./Square";
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]} key={i}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    var rows = [];
    for(var i=0;i<3;i++){
        var row = [];
        for(var j=i*3;j<3*i+3;j++){
            row.push(this.renderSquare(j));
        }
        rows.push(<div className="board-row" key={Math.random()}>{row}</div>)
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}
export default Board;
