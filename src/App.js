
// src/App.js
import React, { useState, useEffect } from 'react';
import LandingScreen from './components/LandingScreen';
import UploadScreen from './components/UploadScreen';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import ResetButton from './components/ResetButton';
import MoveHistory from './components/MoveHistory';
import { checkWin, getAvailableRow } from './utils/gameLogic';
import "./styles.css";

// New backend endpoint
const API_BASE = "https://connect4-backend-fa34b2d6116b.herokuapp.com";

const ROWS = 6;
const COLUMNS = 7;
const createEmptyBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));

function App() {
  // Screens: "landing", "upload", "game"
  const [screen, setScreen] = useState("landing");
  // Players config using keys "1" and "-1"
  const [players, setPlayers] = useState(null);
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or -1
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([]);
  const [isAIMoving, setIsAIMoving] = useState(false);

  // New state for battle mode
  const [gameMode, setGameMode] = useState("");
  const [battleGameCount, setBattleGameCount] = useState(0);
  const [battleScore, setBattleScore] = useState({});
  const [battleSwap, setBattleSwap] = useState(false);
  const [battleIdentities, setBattleIdentities] = useState({});

  // Applies a move by “dropping” a token into the chosen column.
  const applyMove = (columnIndex) => {
    const rowIndex = getAvailableRow(board, columnIndex);
    if (rowIndex === -1) return;
    const newBoard = board.map(row => [...row]);
    newBoard[rowIndex][columnIndex] = currentPlayer;
    setBoard(newBoard);
    setHistory([...history, { player: currentPlayer, row: rowIndex, col: columnIndex }]);
    if (checkWin(newBoard, rowIndex, columnIndex, currentPlayer)) {
      setWinner(currentPlayer);
    } else if (newBoard[0].every(cell => cell !== 0)) {
      setWinner(0);
    } else {
      setCurrentPlayer(currentPlayer * -1);
    }
  };

  const handleCellClick = (columnIndex) => {
    if (
      winner !== null ||
      isAIMoving ||
      (players && players[currentPlayer.toString()].type === "ai")
    )
      return;
    applyMove(columnIndex);
  };

  const makeAIMove = () => {
    setIsAIMoving(true);
    const currentConfig = players[currentPlayer.toString()];
    const endpoint = currentConfig.modelId
      ? `${API_BASE}/api/ai-move/${currentConfig.modelId}`
      : `${API_BASE}/api/move`;
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board, aiPlayer: currentPlayer }),
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data.column === 'number') {
          applyMove(data.column);
        }
        setIsAIMoving(false);
      })
      .catch(error => {
        console.error('Error fetching AI move:', error);
        setIsAIMoving(false);
      });
  };

  useEffect(() => {
    if (
      players &&
      players[currentPlayer.toString()].type === "ai" &&
      winner === null
    ) {
      const timer = setTimeout(makeAIMove, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, winner, board, players]);

  useEffect(() => {
    // For AI Battle mode: update score and reset board (if fewer than 10 games have been played)
    if (gameMode === "ai-battle" && winner !== null) {
      setBattleScore(prevScore => {
        const newScore = { ...prevScore };
        if (winner === 0) {
          newScore.draws = (newScore.draws || 0) + 1;
        } else if (winner === 1) {
          const winnerName = battleSwap ? battleIdentities.ai2 : battleIdentities.ai1;
          newScore[winnerName] = (newScore[winnerName] || 0) + 1;
        } else {
          const winnerName = battleSwap ? battleIdentities.ai1 : battleIdentities.ai2;
          newScore[winnerName] = (newScore[winnerName] || 0) + 1;
        }
        return newScore;
      });
      if (battleGameCount < 10) {
        setTimeout(() => {
          setBattleSwap(!battleSwap);
          setBoard(createEmptyBoard());
          setCurrentPlayer(1);
          setWinner(null);
          setHistory([]);
          setIsAIMoving(false);
          setBattleGameCount(battleGameCount + 1);
        }, 2000);
      }
    }
  }, [winner, gameMode, battleGameCount, battleIdentities, battleSwap]);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setWinner(null);
    setHistory([]);
    setIsAIMoving(false);
    if (gameMode === "ai-battle") {
      setBattleGameCount(0);
      setBattleScore({});
      setBattleSwap(false);
    }
  };

  const startGame = (playersConfig, mode) => {
    setPlayers(playersConfig);
    setGameMode(mode);
    if (mode === "ai-battle") {
      setBattleGameCount(1);
      setBattleIdentities({
        ai1: playersConfig["1"].name,
        ai2: playersConfig["-1"].name
      });
      setBattleScore({
        [playersConfig["1"].name]: 0,
        [playersConfig["-1"].name]: 0,
        draws: 0
      });
    }
    setScreen("game");
  };

  if (screen === "landing") {
    return <LandingScreen onNext={() => setScreen("upload")} />;
  }
  if (screen === "upload") {
    return <UploadScreen onStartGame={startGame} />;
  }
  return (
    <div className="app-container">
      <h1>{gameMode === "ai-battle" ? "AI Battle" : "Connect 4 AI Battle"}</h1>
      {gameMode === "ai-battle" && (
        <div className="battle-score">
          <p>Game {battleGameCount} of 10</p>
          <p>{battleIdentities.ai1}: {battleScore[battleIdentities.ai1] || 0}</p>
          <p>{battleIdentities.ai2}: {battleScore[battleIdentities.ai2] || 0}</p>
          <p>Draws: {battleScore.draws || 0}</p>
        </div>
      )}
      <GameInfo
        currentPlayer={currentPlayer}
        winner={winner}
        players={
          gameMode === "ai-battle"
            ? {
                "1": { name: battleSwap ? battleIdentities.ai2 : battleIdentities.ai1 },
                "-1": { name: battleSwap ? battleIdentities.ai1 : battleIdentities.ai2 }
              }
            : players
        }
      />
      <Board board={board} onCellClick={handleCellClick} />
      <ResetButton resetGame={resetGame} />
      <MoveHistory history={history} />
    </div>
  );
}

export default App;

