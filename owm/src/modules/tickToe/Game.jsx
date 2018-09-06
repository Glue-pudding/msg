import React from "react";
import Board from "./Board";
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isReverse: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    let xIndex = Math.floor(i / 3) + 1,
      yIndex = (i % 3) + 1;
    this.setState({
      history: history.concat([
        {
          squares: squares,
          lastStep:
            squares[i] + " moves to " + "(" + xIndex + "," + yIndex + ")"
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }
  sortHistory() {
    this.setState({
      isReverse: !this.state.isReverse
    });
  }
  render() {
    const { history, isReverse } = this.state;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const curRole = this.state.xIsNext ? "X" : "O";
    let newHistory = history.slice();
    if (isReverse) {
      newHistory.reverse();
    }
    console.log(isReverse, "curhistory :", newHistory, "old");
    const moves = newHistory.map((step, move) => {
      let isEnd = this.state.stepNumber === move;
      const desc = isReverse
        ? isEnd
          ? "Go to game start"
          : step.lastStep
        : move
          ? step.lastStep
          : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {isEnd ? <strong>{desc}</strong> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + curRole;
    }

    return (
      <div className="game">
        <button onClick={this.sortHistory.bind(this)}>sort</button>
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
export default Game;
