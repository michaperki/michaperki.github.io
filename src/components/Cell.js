
// src/components/Cell.js
import React from 'react';

const Cell = ({ value }) => {
  let className = 'cell';
  if (value === 1) {
    className += ' player1'; // e.g. red token
  } else if (value === -1) {
    className += ' player2'; // e.g. yellow token
  }
  return <div className={className}></div>;
};

export default Cell;

