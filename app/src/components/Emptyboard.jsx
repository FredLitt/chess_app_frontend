import React from 'react'

export default function Emptyboard({chess}) {

  return (
    <table 
    id="board"
    cellSpacing="0">
    <tbody>
    {chess.createEmptyBoard().map((row, index) =>
      <tr 
        className="board-row"
        key={index}>
        {row.map((square) => 
          <td 
            className="square"
            key={square.coordinates}
            style={{backgroundColor: square.color === "light" ? "var(--light-square)" : "var(--dark-square)"}}>
              </td>)}
        </tr>)}
    </tbody>
  </table>)
}
