import React from "react";

export default function NewGameModal({gameOver, startNewGame}){

return (
  <>
    <div id="new-game-modal">
        <div id="new-game-modal-content">
            <div>{gameOver.result}! {gameOver.score}</div>
            <button onClick={() => {startNewGame()}}>
            New Game</button>
        </div>
    </div>
  </>
)}
