import React, { useEffect } from "react"

export default function GameOptionsBar(notation){

  useEffect(() => {
    scrollToBottom()
  });

  const notationContainer = document.querySelector("#notation")

  const scrollToBottom = () => {
    if (notation.notation.length > 8) {
      console.log("Scroll!")
      notationContainer.scrollTop = notationContainer.scrollHeight
    }
  }

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