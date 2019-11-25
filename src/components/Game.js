import React from 'react';
import Board from './Board';

/**
 * represents the Game component
 * @extends React.Component
 */
class Game extends React.Component {
  /**
   * create a game
   * @param {Object} props always passed to access parent props
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
      xIsNext: true,
    };
  }

  /**
   * event listener for square click on game board
   * @param {number} i index of the square that was clicked
   */
  onSquareClick(i) {
    const boardHistory = this.state.boardHistory.slice(0, this.state.stepNumber + 1); // shallow copy in case player has jumped back in history
    const coordinateHistory = this.state.coordinateHistory.slice(0, this.state.stepNumber + 1); // shallow copy in case player has jumped back in history
    const currentBoard = boardHistory[this.state.stepNumber];
    const currentSquares = currentBoard.squares.slice();
    const currentLocation = this.getCoordinates(i);

    // return early if someone has won or the square is already filled
    if (this.getWinningSequence(currentSquares) || currentSquares[i]) {
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
      xIsNext: !this.state.xIsNext,
    });
  }

  /**
   * checks if there is a winning sequence
   * @param   {number[]}        squares squares to check from
   * @returns {(number[]|null)}         a winning sequence or null
   */
  getWinningSequence(squares) {
    // array of winning sequences
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // check if all values in locations in i are same
    for (const i of lines) {
      const [a, b, c] = i;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return i;
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
      [6, 7, 8],
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
      xIsNext: (step % 2) === 0,
    });
  }

  /**
   * event listener for sort button click
   */
  onSortClick() {
    // reverses the sort direction
    this.setState({sortAscending: !this.state.sortAscending});
  }

  /**
   * resets the game state except the sort direction
   */
  reset() {
    this.setState({
      boardHistory: [
        {squares: Array(9).fill(null)}
      ],
      coordinateHistory: [
        {coordinates: Array(2).fill(null)}
      ],
      stepNumber: 0,
      xIsNext: true,
    });
  }

  /**
   * renders a Game component
   * @returns {Object} a rendered Game
   */
  render() {
    const boardHistory = Array.from(this.state.boardHistory);
    const coordinateHistory = Array.from(this.state.coordinateHistory);
    const currentSquares = boardHistory[this.state.stepNumber].squares.slice();
    const winningSequence = this.getWinningSequence(currentSquares);
    const status = winningSequence
      ? `Winner: ${currentSquares[winningSequence[0]]}`
      : currentSquares.includes(null)
        ? `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`
        : 'Draw';
    const result = status.charAt(0) !== 'N'; // for .game-info-separator-result class
    const sort = this.state.sortAscending; // true if history is ascending
    const limit = sort ? boardHistory.length : 1;
    const steps = [], moves = []; // array of step number and associated moves

    // loops through number of steps in direction of sort
    for (let i = sort ? 1 : boardHistory.length - 1; sort ? i < limit : i >= limit; sort ? i++ : i--) {
      const desc = `${(i % 2) === 0 ? 'O' : 'X'} played at (${coordinateHistory[i].coordinates})`;
      let activeStep = i === this.state.stepNumber ? 1 : 0; // check if i is the active step for .active-step class

      // push step numbers and move buttons
      steps.push(<div key={i}>{i}</div>);
      moves.push(
        <div key={i}>
          <button
            onClick={() => this.jumpTo(i)}
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
          winningSequence={winningSequence}
          onClick={i => this.onSquareClick(i)}
        />

        <div className="game-info">
          <div>{status}</div>
          <div className={"game-info-separator" + (result ? " game-info-separator-result" : "")}></div>
          <div className="game-info-history-header">
            <div>Moves</div>
            <button onClick={() => this.reset()}>Reset</button>
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

export default Game;
