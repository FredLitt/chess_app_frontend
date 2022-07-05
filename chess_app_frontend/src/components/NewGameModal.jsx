import React from "react";

export default function NewGameModal({gameOver, toggleCreateGame}){

return (
  <>
    <div className="modal">
        <div id="new-game-modal-content">
            <div>{gameOver.result}! {gameOver.score}</div>
            <button onClick={toggleCreateGame}>Create New Game?</button>
        </div>
    </div>
  </>
)}
