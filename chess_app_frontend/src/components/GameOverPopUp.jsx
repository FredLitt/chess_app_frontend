import React from "react";
import ClosePopUpButton from "./ClosePopUpButton";

export default function GameOverPopUp({gameOver, toggleCreateGame, closePopUp}){

  const handleClick = () => {
    toggleCreateGame()
    closePopUp()
  }

return (
  <div className="popup">
    <ClosePopUpButton closePopUp={closePopUp} />
    <div>{gameOver.result} {gameOver.score}</div>
    <button onClick={handleClick}>Create New Game?</button>
  </div>
)}
