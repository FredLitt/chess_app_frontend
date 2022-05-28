import React from "react";

export default function BoardUI({board, setBoard}){

  return (
    <>
      <table 
        id="board"
        cellSpacing="0">
        <tbody>
        {board.map((row, index) =>
          <tr 
            className="board-row"
            key={index}>
            {row.map((square) => 
              <td 
                className="square"
                coordinate={square.coordinate}
                piece={square.piece}
                key={square.coordinate} 
                style={{
                  backgroundColor: square.color === "light" ? "white" : "black"}}>
                  </td>)}
            </tr>)}
        </tbody>
      </table>
    </>
    )
}