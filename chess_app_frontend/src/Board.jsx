import React from "react";

const pieceSymbols = {
  "pawn": {
    "white": "\u2659",
    "black": "\u265F"
  },
  "knight": {
    "white": "\u2658",
    "black": "\u265E"
  },
  "bishop": {
    "white": "\u2657",
    "black": "\u265D"
  },
  "rook": {
    "white": "\u2656",
    "black": "\u265C"
  },
  "queen": {
    "white": "\u2655",
    "black": "\u265B"
  },
  "king": {
    "white": "\u2654",
    "black": "\u265A"
  }
}

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
                  backgroundColor: square.color === "light" ? "white" : "grey"}}>
                    { square.piece !== null ? pieceSymbols[square.piece.type][square.piece.color] : " "}
                  </td>)}
            </tr>)}
        </tbody>
      </table>
    </>
    )
}