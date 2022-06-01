import React from "react"

export default function GameOptionsBar(notation){

  const getMoveNumber = (index) => {
    return Math.round(index/2+1)
  }

  return (
    <ul id="notation">
      {notation.notation.map((move, index) => 
        <li
          key={index}>
          {index % 2 === 0 &&
          <span className="move-number">
          {`${getMoveNumber(index)}. `}</span>}{move}
          </li>)}
          </ul>
  )
}