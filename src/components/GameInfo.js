
// src/components/GameInfo.js
import React from 'react';

const GameInfo = ({ currentPlayer, winner, players }) => {
  let status;
  if (winner === null) {
    status = `${players[currentPlayer.toString()].name}'s turn`;
  } else if (winner === 0) {
    status = "It's a draw!";
  } else {
    status = `${players[winner.toString()].name} wins!`;
  }
  return <div className="game-info">{status}</div>;
};

export default GameInfo;

