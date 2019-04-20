import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';

/**
 * represents the Game component
 * @extends React.Component
 */
class Game extends React.Component {
  /**
   * create a game
   * @param {Object} props - always passed to access parent functions
   */
  constructor(props) {
    super(props);
    this.state = {
      boardHistory: [
        {squares: Array(9).fill(null)}
      ],
      coordinateHistory: [
        {coordinates: Array(2).fill(null)}
      ],
      sortAscending: true,
      stepNumber: 0,
      xIsNext: true
    };
  }

  /**
   * event listener for square click on game board
   * @param {number} i - index of the square that was clicked
   */
  onSquareClick(i) {
    const boardHistory = this.state.boardHistory.slice(0, this.state.stepNumber + 1); // slice in case player has jumped back in history
    const coordinateHistory = this.state.coordinateHistory.slice(0, this.state.stepNumber + 1); // slice in case player has jumped back in history
    const currentBoard = boardHistory[this.state.stepNumber];
    const currentSquares = currentBoard.squares.slice();
    const currentLocation = this.getCoordinates(i);

    // return early if someone has won or the square is already filled
    if (this.calculateWinner(currentSquares) || currentSquares[i]) {
      return;
    }

    // set value of square based on whose turn it is
    currentSquares[i] = this.state.xIsNext ? 'X' : 'O';

    // set state to save history and prepare for next turn
    this.setState({
      boardHistory: boardHistory.concat([
        {squares: currentSquares}
      ]),
      coordinateHistory: coordinateHistory.concat([
        {coordinates: currentLocation}
      ]),
      stepNumber: boardHistory.length,
      xIsNext: !this.state.xIsNext
    });
  }

  /**
   * checks if there is a winning sequence
   * @param {number[]} squares - squares to check from
   * @returns {(number[]|null)} a winning sequence or null
   */
  calculateWinner(squares) {
    // array of winning sequences
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

    // check if all values in locations in i are same
    for (const i of lines) {
      const [a, b, c] = i;
      if (squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  /**
   * get the coordinates of a square
   * @param {number} square - the index of a square on the board
   * @returns {number[]} the row and column number of the square
   */
  getCoordinates(square) {
    // 2D array to locate argument square on the board
    const board = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8]
    ];
    let row, column;

    // check which row and column contain square
    for (const i of board) {
      if (i.includes(square)) {
        row = board.indexOf(i);
        column = board[row].indexOf(square);
        break;
      }
    }

    return [row, column];
  }

  /**
   * jumps to a step in the game history
   * @param {number} step - the step to jump to
   */
  jumpTo(step) {
    // set stepNumber to step argument and check whose turn it is
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  /**
   * event listener for sort button click
   */
  onSortClick() {
    // reverses the sort direction
    this.setState({
      sortAscending: !this.state.sortAscending
    });
  }

  /**
   * renders a Game component
   * @returns {Object} a rendered Game
   */
  render() {
    const boardHistory = this.state.boardHistory;
    const coordinateHistory = this.state.coordinateHistory;
    const currentSquares = boardHistory[this.state.stepNumber].squares.slice();
    const winner = this.calculateWinner(currentSquares);
    const status = winner
      ? `Winner: ${winner}`
      : `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`;
    const sort = this.state.sortAscending; // true if history is ascending
    const limit = sort ? boardHistory.length : 0;
    const steps = [], moves = []; // array of step number and associated moves

    // loops through number of steps in direction of sort
    for (let index = sort ? 0 : boardHistory.length - 1; sort ? index < limit : index >= limit; sort ? index++ : index--) {
      const desc = index
        ? `${(index % 2) === 0 ? 'O' : 'X'} played at (${coordinateHistory[index].coordinates})`
        : 'Start';
      let activeStep = index === this.state.stepNumber ? 1 : 0; // check if index is the active step for css class

      // push step numbers and move buttons
      steps.push(<div key={index}>{index}</div>);
      moves.push(
        <div key={index}>
          <button
            onClick={() => this.jumpTo(index)}
            className={activeStep ? "active-step" : ""}
          >
            {desc}
          </button>
        </div>
      );
    }

    return (
      <div className="game">
        <Board
          squares={currentSquares}
          onClick={(i) => this.onSquareClick(i)}
        />

        <div className="game-info">
          <div>{status}</div>
          <div className="game-info-separator"></div>
          <div className="game-info-history-header">
            <div>Moves</div>
            <button onClick={() => this.onSortClick()}>
              Sort {this.state.sortAscending ? "▼" : "▲"}
            </button>
          </div>
          <div className="game-info-history">
            <div className="game-info-steps">
              {steps}
            </div>
            <div className="game-info-moves">
              {moves}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * represents the game Board component
 * @extends React.Component
 */
class Board extends React.Component {
  /**
   * renders a single Square component
   * @param {number} i - the index of the square to render
   * @returns {Object} a rendered Square
   */
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  /**
   * renders a Board component filled with Squares
   * @returns {Object} a rendered Board
   */
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
      <div className="game-board">
        {rows}
      </div>
    );
  }
}

/**
 * represents a Square component
 * @class
 * @param {Object} props - always passed to access parent functions
 * @returns {Object} a rendered square button
 */
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

// render the game into the DOM in #root
ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);
