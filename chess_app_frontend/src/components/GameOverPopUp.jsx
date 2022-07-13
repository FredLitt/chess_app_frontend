import React from "react";

export default function GameOverPopUp({gameOver, toggleCreateGame, closePopUp}){

  const handleClick = () => {
    toggleCreateGame()
    closePopUp()
  }

return (
  <div className="popup">
    <button className="close-popup-button" onClick={closePopUp}>X</button>
    <div>{gameOver.result} {gameOver.score}</div>
    <button onClick={handleClick}>Create New Game?</button>
  </div>
)}
