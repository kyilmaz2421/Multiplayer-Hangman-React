import React from "react";

const HangmanPanel = ({ playerNames, playerMoves, players }) => {
  return (
    <div>
      <h2 className="gameLogsTitle">Game Logs</h2>
      <div className="playersList">
        {players.map((player, i) => (
          <div key={i}>{player}</div>
        ))}
      </div>
      <div className="hangmanLogs">
        <div>
          {playerNames.map((player, i) => (
            <div key={i}>
              {playerNames[playerNames.length - (i + 1)]} guessed the letter: "
              {playerMoves[playerMoves.length - (i + 1)]}"
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HangmanPanel;
