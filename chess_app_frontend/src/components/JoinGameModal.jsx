import React, { useState } from "react";
import CloseModalButton from "./CloseModalButton";

export default function JoinGameModal({joinGame, closeModal}){

const [ gameID, setGameID ] = useState("")

const handleKeydown = (e) => {
  if (e.key === "Enter" && gameID !== ""){
    joinGame(gameID)
    closeModal()
    setGameID("")
  } 
}

return (
  <>
    <div className="modal">Enter ID of game to join
      <CloseModalButton closeModal={closeModal} />
        <input 
        type="text" 
        value={gameID} 
        onChange={(e) => setGameID(e.target.value)} 
        onKeyDown={handleKeydown} />
    </div>
  </>
)}