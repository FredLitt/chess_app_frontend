import React, { useState } from "react";

export default function JoinGamePopUp({joinGame, closePopUp}){

const [ id, setID ] = useState(null)

const handleKeydown = (e) => {
  if (e.key === "Enter"){
    joinGame(id)
    setID(null)
  }
}

return (
  <>
    <div id="join-game-popup">Enter ID of game to join
      <button className="close-popup-button" onClick={closePopUp}>X</button>
        <input type="text" onChange={(e) => setID(e.target.value)} onKeyDown={handleKeydown} />
    </div>
  </>
)}
