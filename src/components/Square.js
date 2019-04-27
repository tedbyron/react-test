import React from 'react';
import './Square.css';

/**
 * represents a Square component
 * @class
 * @param   {Object} props always passed to access parent props
 * @returns {Object}       a rendered square button
 */
function Square(props) {
  return (
    <button
      className={"square" + props.squareClass}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

export default Square;
