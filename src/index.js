import React from 'react';
import ReactDOM from 'react-dom';

import 'normalize.css';
import './index.css';
import Game from './components/Game';

// render the game into the DOM in #root
ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);
