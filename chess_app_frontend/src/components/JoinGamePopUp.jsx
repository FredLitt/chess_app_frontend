import React, { useState } from "react";

export default function JoinGamePopUp({joinGame, closePopUp}){

const [ id, setID ] = useState("")

const handleKeydown = (e) => {
  if (e.key === "Backspace"){
    setID("")
  }
  if (e.key !== "Enter"){
    setID(id)
  }
  if (e.key === "Enter"){
    joinGame(id)
    setID("")
  } 
}

return (
  <>
    <div id="join-game-popup">Enter ID of game to join
      <button className="close-popup-button" onClick={closePopUp}>X</button>
        <input type="text" value={id} onKeyDown={handleKeydown} onPaste={(e) => setID(e.clipboardData.getData("Text"))}/>
    </div>
  </>
)}
