import React, { useState } from 'react'
import CloseModalButton from './CloseModalButton'

export default function CreateGameModal({ createGame, closePopUp }) {

  const [ colorChoice, setColorChoice ] = useState(null)

  return (
      <div className="modal">
        <CloseModalButton closePopUp={closePopUp} />
        <div>Choose your color</div>  
        <div>   
          <button onClick={(e) => setColorChoice(e.target.value)} value="white" style={{backgroundColor: colorChoice === "white" ? "slategray" : "lightgrey"}}>White</button>
          <button onClick={(e) => setColorChoice(e.target.value)} value="black" style={{backgroundColor: colorChoice === "black" ? "slategray" : "lightgrey"}}>Black</button>
        </div>
        <button onClick={() => createGame(colorChoice)} style={{backgroundColor: "lightgrey"}}>Create Game!</button>    
        </div>
  )
}
