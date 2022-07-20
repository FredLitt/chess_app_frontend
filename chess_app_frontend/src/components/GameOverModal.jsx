import React from "react";
import CloseModalButton from "./CloseModalButton";

export default function GameOverModal({status, toggleCreateGame, closeModal}){

  const result = status.result.charAt(0).toUpperCase() + status.result.slice(1)

return (
  <div className="modal">
    <CloseModalButton closeModal={closeModal} />
    <div>{result}! {status.score}</div>
  </div>
)}