import React, { useState } from "react";

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

export default function BoardUI({board, setBoard, move}){

  const [ pieceToMove, setPieceToMove ] = useState(null)

  const movePiece = (square) => {
    const targetSquare = square.target.coordinates
    console.log("moving piece to:", targetSquare)
    const moveToPlay = {
      piece: pieceToMove.piece,
      from: pieceToMove.square,
      to: targetSquare
    }
    console.log("moving", moveToPlay)
    move(moveToPlay)
    // (if move = valid){
    // services.updateBoard
    // } 
    setPieceToMove(null)
  }

  const selectPiece = (square) => {
    const selectedPiece = {
      piece: {
        type: square.target.getAttribute("pieceType"),
        color: square.target.getAttribute("pieceColor")
      },
      square: square.target.getAttribute("coordinates")
    }
    console.log(selectedPiece.piece)
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
                pieceType={square.piece ? square.piece.type.toString() : null}
                pieceColor={square.piece ? square.piece.color.toString() : null}
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