import React, { useEffect } from "react"

export default function GameOptionsBar({ notation }){

  useEffect(() => {
    const scrollToBottom = () => {
     if (notation.length > 8) {
        const notationContainer = document.querySelector("#notation")
        notationContainer.scrollTop = notationContainer.scrollHeight
      }
    }
    scrollToBottom()
  });

  const getMoveNumber = (index) => {
    return Math.round(index/2+1)
  }

  return (
    <ul id="notation">
      {notation.map((move, index) => 
        <li
          key={index}>
          {index % 2 === 0 &&
          <span className="move-number">
          {`${getMoveNumber(index)}. `}</span>}{move}
          </li>)}
          </ul>
  )
}