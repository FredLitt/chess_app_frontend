import React, { useState } from "react";
import pieceSymbols from "./pieceSymbols"



export default function BoardUI({board, setBoard, move}){

  const [ pieceToMove, setPieceToMove ] = useState(null)

  const movePiece = (square) => {
    const targetSquare = square.target.getAttribute("coordinates")
    const moveToPlay = {
      piece: pieceToMove.piece,
      from: pieceToMove.square,
      to: targetSquare
    }
    move(moveToPlay)
    setPieceToMove(null)
  }

  const selectPiece = (square) => {
    const selectedPiece = {
      piece: {
        type: square.target.getAttribute("piecetype"),
        color: square.target.getAttribute("piececolor")
      },
      square: square.target.getAttribute("coordinates")
    }
    setPieceToMove(selectedPiece)
  }

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
                coordinates={square.coordinates}
                piecetype={square.piece ? square.piece.type.toString() : null}
                piececolor={square.piece ? square.piece.color.toString() : null}
                key={square.coordinates} 
                onClick={ pieceToMove ? (e) => movePiece(e) : (e) => selectPiece(e)}
                style={{
                  backgroundColor: square.color === "light" ? "white" : "grey"}}>
                    { square.piece ? pieceSymbols[square.piece.type][square.piece.color] : " "}
                  </td>)}
            </tr>)}
        </tbody>
      </table>
    </>
    )
}