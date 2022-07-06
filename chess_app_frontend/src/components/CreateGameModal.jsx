import React, { useState } from 'react'

export default function CreateGameModal({selectColor, createGame}) {

  const [ colorChoice, setColorChoice ] = useState(null)



  return (
    <div className="modal">
      <div id="create-game-modal-content">
        <div>Choose your color</div>
        <button onClick={(e) => setColorChoice(e.target.value)} value="white" style={{backgroundColor: colorChoice === "white" ? "lightgreen" : "white"}}>White</button>
        <button onClick={(e) => setColorChoice(e.target.value)} value="black" style={{backgroundColor: colorChoice === "black" ? "lightgreen" : "white"}}>Black</button>
        <button onClick={() => createGame(colorChoice)}>Create Game!</button>
      </div>
    </div>
  )
}
