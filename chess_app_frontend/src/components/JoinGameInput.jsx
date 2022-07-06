import React, { useState } from "react";

export default function JoinGameInput({joinGame}){

const [ id, setID ] = useState(null)

const handleKeydown = (e) => {
  if (e.key === "Enter"){
    joinGame(id)
    setID(null)
  }
}

return (
  <>
    <div id="join-game-input">Enter ID of game to join
        <input type="text" onChange={(e) => setID(e.target.value)} onKeyDown={handleKeydown} />
    </div>
  </>
)}
