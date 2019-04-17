import React from 'react';
import ReactDOM from 'react-dom';
import './normalize.css';
import './index.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {squares: Array(9).fill(null)},
        {coordinates: Array(2).fill(null)}
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber * 2 + 2);
    const currentBoard = history[this.state.stepNumber * 2];
    const currentSquares = currentBoard.squares.slice();
    const currentLocation = this.getCoordinates(i);

    if (this.calculateWinner(currentSquares) || currentSquares[i]) {
      return;
    }

    currentSquares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {squares: currentSquares},
        {coordinates: currentLocation}
      ]),
      stepNumber: history.length / 2,
      xIsNext: !this.state.xIsNext
    });
  }

  calculateWinner(squares) {
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

  getCoordinates(square) {
    const board = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8]
    ];
    let row, column;

    for (let i of board) {
      if (i.includes(square)) {
        row = board.indexOf(i);
        break;
      }
    }
    column = board[row].indexOf(square);

    return [row, column];
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const currentBoard = history[this.state.stepNumber * 2];
    const winner = this.calculateWinner(currentBoard.squares);
    let moves = [];

    for (let i = 0; i < history.length / 2; i++) {
      const desc = i
        ? `Go to move #${i}`
        : 'Go to game start';
      moves.push(
        <li key={i}>
          <button onClick={() => this.jumpTo(i)}>{desc}</button>
        </li>
      )
    }

    let status = winner
      ? `Winner: ${winner}`
      : `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentBoard.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const cells = [];
      for (let j = 0; j < 3; j++) {
        cells.push(this.renderSquare(i * 3 + j));
      }
      rows.push(<div key={i} className="board-row">{cells}</div>);
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
