import React, { useState } from 'react'

export default function CreateGamePopUp({ createGame, closePopUp }) {

  const [ colorChoice, setColorChoice ] = useState(null)

  return (
      <div className="popup">
        <button className="close-popup-button" onClick={closePopUp}>X</button>
        <div>Choose your color</div>  
        <div>   
          <button onClick={(e) => setColorChoice(e.target.value)} value="white" style={{backgroundColor: colorChoice === "white" ? "slategray" : "lightgrey"}}>White</button>
          <button onClick={(e) => setColorChoice(e.target.value)} value="black" style={{backgroundColor: colorChoice === "black" ? "slategray" : "lightgrey"}}>Black</button>
        </div>
        <button onClick={() => createGame(colorChoice)} style={{backgroundColor: "lightgrey"}}>Create Game!</button>    
        </div>
  )
}
