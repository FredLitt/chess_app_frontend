import React, { useState } from "react";

export default function JoinGameModal({joinGame, closePopUp}){

const [ gameID, setGameID ] = useState("")

const handleKeydown = (e) => {
  if (e.key === "Enter" && gameID !== ""){
    joinGame(gameID)
    setGameID("")
  } 
}

return (
  <>
    <div className="modal">Enter ID of game to join
      <button className="close-modal-button" onClick={closePopUp}>X</button>
        <input 
        type="text" 
        value={gameID} 
        onChange={(e) => setGameID(e.target.value)} 
        onKeyDown={handleKeydown} />
    </div>
  </>
)}
