
import React from 'react';

const LandingScreen = ({ onNext }) => {
  return (
    <div className="landing-screen">
      <h1>Welcome to Connect 4 AI Battle</h1>
      <button onClick={onNext}>Initiate Connect4 AI Battle</button>
    </div>
  );
};

export default LandingScreen;
