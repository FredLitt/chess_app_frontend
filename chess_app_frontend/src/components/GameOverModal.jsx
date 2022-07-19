import React from "react";
import CloseModalButton from "./CloseModalButton";

export default function GameOverModal({gameOver, toggleCreateGame, closeModal}){

return (
  <div className="popup game-over">
    <CloseModalButton closeModal={closeModal} />
    <div>{gameOver.result}! {gameOver.score}</div>
  </div>
)}