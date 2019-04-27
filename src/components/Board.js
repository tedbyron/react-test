import React from 'react';
import Square from './Square';

/**
 * represents the game Board component
 * @extends React.Component
 */
class Board extends React.Component {
  /**
   * renders a single Square component
   * @param   {number} i the index of the square to render
   * @returns {Object}   a rendered Square
   */
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        squareClass={this.props.winningSequence ? this.props.winningSequence.includes(i) ? " highlight" : "" : ""}
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

export default Board;
