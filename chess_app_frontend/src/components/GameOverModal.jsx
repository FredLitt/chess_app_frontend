import React from "react";
import ClosePopUpButton from "./ClosePopUpButton";

export default function GameOverModal({gameOver, toggleCreateGame, closePopUp}){

return (
  <div className="popup game-over">
    <ClosePopUpButton closePopUp={closePopUp} />
    <div>{gameOver.result}! {gameOver.score}</div>
  </div>
)}
