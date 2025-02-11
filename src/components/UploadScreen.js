
// src/components/UploadScreen.js
import React, { useState } from 'react';

const UploadScreen = ({ onStartGame }) => {
  // mode can be "human-vs-ai", "ai-vs-ai", or "ai-battle"
  const [mode, setMode] = useState("human-vs-ai");

  const [player1, setPlayer1] = useState({
    type: mode === "human-vs-ai" ? "human" : "ai",
    name: mode === "human-vs-ai" ? "Human" : (mode === "ai-battle" ? "AI Battle 1" : "AI 1"),
    file: null,
    modelId: null,
    uploading: false,
    message: ""
  });

  const [player2, setPlayer2] = useState({
    type: "ai",
    name: mode === "human-vs-ai" ? "AI" : (mode === "ai-battle" ? "AI Battle 2" : "AI 2"),
    file: null,
    modelId: null,
    uploading: false,
    message: ""
  });

  const handleModeChange = (e) => {
    const selectedMode = e.target.value;
    setMode(selectedMode);
    if (selectedMode === "human-vs-ai") {
      setPlayer1(prev => ({ ...prev, type: "human", name: "Human", file: null, modelId: null, message: "" }));
      setPlayer2(prev => ({ ...prev, type: "ai", name: "AI", file: null, modelId: null, message: "" }));
    } else if (selectedMode === "ai-battle") {
      setPlayer1(prev => ({ ...prev, type: "ai", name: "AI Battle 1", file: null, modelId: null, message: "" }));
      setPlayer2(prev => ({ ...prev, type: "ai", name: "AI Battle 2", file: null, modelId: null, message: "" }));
    } else {
      setPlayer1(prev => ({ ...prev, type: "ai", name: "AI 1", file: null, modelId: null, message: "" }));
      setPlayer2(prev => ({ ...prev, type: "ai", name: "AI 2", file: null, modelId: null, message: "" }));
    }
  };

  const handleNameChange = (playerNum, name) => {
    if (playerNum === 1) {
      setPlayer1(prev => ({ ...prev, name }));
    } else {
      setPlayer2(prev => ({ ...prev, name }));
    }
  };

  const handleFileChange = (playerNum, file) => {
    if (playerNum === 1) {
      setPlayer1(prev => ({ ...prev, file }));
    } else {
      setPlayer2(prev => ({ ...prev, file }));
    }
  };

  const updatePlayer = (playerNum, update) => {
    if (playerNum === 1) {
      setPlayer1(prev => ({ ...prev, ...update }));
    } else {
      setPlayer2(prev => ({ ...prev, ...update }));
    }
  };

  const uploadModel = (playerNum) => {
    const player = playerNum === 1 ? player1 : player2;
    if (!player.file) {
      updatePlayer(playerNum, { message: "Please select a file first." });
      return;
    }
    updatePlayer(playerNum, { uploading: true, message: "" });
    const formData = new FormData();
    formData.append('model', player.file);
    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.modelId) {
          updatePlayer(playerNum, { modelId: data.modelId, message: "Upload successful!", uploading: false });
        } else {
          updatePlayer(playerNum, { message: "Upload failed.", uploading: false });
        }
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        updatePlayer(playerNum, { message: "Upload error.", uploading: false });
      });
  };

  const handleStartGame = () => {
    const config = {
      "1": {
        type: mode === "human-vs-ai" ? "human" : "ai",
        name: mode === "ai-battle" ? "AI Battle 1" : player1.name,
        modelId: player1.modelId
      },
      "-1": {
        type: "ai",
        name: mode === "ai-battle" ? "AI Battle 2" : player2.name,
        modelId: player2.modelId
      }
    };
    onStartGame(config, mode);
  };

  return (
    <div className="upload-screen">
      <h1>Configure AI Battle</h1>
      <div>
        <label>
          <input
            type="radio"
            value="human-vs-ai"
            checked={mode === "human-vs-ai"}
            onChange={handleModeChange}
          />
          Human vs AI
        </label>
        <label>
          <input
            type="radio"
            value="ai-vs-ai"
            checked={mode === "ai-vs-ai"}
            onChange={handleModeChange}
          />
          AI vs AI
        </label>
        <label>
          <input
            type="radio"
            value="ai-battle"
            checked={mode === "ai-battle"}
            onChange={handleModeChange}
          />
          AI Battle
        </label>
      </div>
      <hr />
      {mode === "human-vs-ai" ? (
        <div>
          <h2>Player 1 (Human)</h2>
          <label>
            Name:
            <input
              type="text"
              value={player1.name}
              onChange={e => handleNameChange(1, e.target.value)}
            />
          </label>
          <h2>Player 2 (AI)</h2>
          <label>
            Name:
            <input
              type="text"
              value={player2.name}
              onChange={e => handleNameChange(2, e.target.value)}
            />
          </label>
          <div>
            <label>
              Upload AI Model (optional, .py only):
              <input
                type="file"
                accept=".py"
                onChange={e => handleFileChange(2, e.target.files[0])}
              />
            </label>
            <button onClick={() => uploadModel(2)} disabled={player2.uploading}>
              {player2.uploading ? "Uploading..." : "Upload Model"}
            </button>
            {player2.message && <p>{player2.message}</p>}
            {player2.modelId && <p>Model ID: {player2.modelId}</p>}
          </div>
        </div>
      ) : (
        <div>
          <h2>Player 1 (AI){mode === "ai-battle" && " - AI Battle 1"}</h2>
          <label>
            Name:
            <input
              type="text"
              value={player1.name}
              onChange={e => handleNameChange(1, e.target.value)}
            />
          </label>
          <div>
            <label>
              Upload AI Model (optional, .py only):
              <input
                type="file"
                accept=".py"
                onChange={e => handleFileChange(1, e.target.files[0])}
              />
            </label>
            <button onClick={() => uploadModel(1)} disabled={player1.uploading}>
              {player1.uploading ? "Uploading..." : "Upload Model"}
            </button>
            {player1.message && <p>{player1.message}</p>}
            {player1.modelId && <p>Model ID: {player1.modelId}</p>}
          </div>
          <hr />
          <h2>Player 2 (AI){mode === "ai-battle" && " - AI Battle 2"}</h2>
          <label>
            Name:
            <input
              type="text"
              value={player2.name}
              onChange={e => handleNameChange(2, e.target.value)}
            />
          </label>
          <div>
            <label>
              Upload AI Model (optional, .py only):
              <input
                type="file"
                accept=".py"
                onChange={e => handleFileChange(2, e.target.files[0])}
              />
            </label>
            <button onClick={() => uploadModel(2)} disabled={player2.uploading}>
              {player2.uploading ? "Uploading..." : "Upload Model"}
            </button>
            {player2.message && <p>{player2.message}</p>}
            {player2.modelId && <p>Model ID: {player2.modelId}</p>}
          </div>
        </div>
      )}
      <hr />
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
};

export default UploadScreen;

