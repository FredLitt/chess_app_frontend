import React, { useState } from "react";

export default function JoinGamePopUp({joinGame, closePopUp}){

const [ newGameData, setNewGameData ] = useState("")

const handleKeydown = (e) => {
  if (e.key === "Backspace"){
    setNewGameData("")
  }
  if (e.key === "Enter" && newGameData !== ""){
    joinGame(newGameData)
    setNewGameData("")
  } 
  const paste = (e.ctrlKey && e.key === "v")
  console.log(paste)
  if (e.key !== "Enter" && !paste){
    e.preventDefault()
  }
}

return (
  <>
    <div className="popup">Enter ID of game to join
      <button className="close-popup-button" onClick={closePopUp}>X</button>
        <input 
        type="text" 
        value={newGameData} 
        onChange={(e) => setNewGameData(e.target.value)} 
        onKeyDown={handleKeydown} />
    </div>
  </>
)}
