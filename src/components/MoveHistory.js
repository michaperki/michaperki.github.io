
import React from 'react';

const MoveHistory = ({ history }) => {
  return (
    <div className="move-history">
      <h2>Move History</h2>
      <ul>
        {history.map((move, index) => (
          <li key={index}>
            Move {index + 1}: Player {move.player} dropped in column{' '}
            {move.col + 1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoveHistory;
