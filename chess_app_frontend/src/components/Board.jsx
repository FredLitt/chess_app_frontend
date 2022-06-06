import React, { useState, useEffect } from "react";
import pieceSymbols from "../pieceSymbols"

export default function Board({board, playerToMove, move, findPossibleMoves, highlightMovesForPiece}){

  const [ pieceToMove, setPieceToMove ] = useState(null)

  const movePiece = (targetSquare) => {
    // highlightMovesForPiece([])
    //const targetSquare = square.target.getAttribute("coordinates")
    const moveToPlay = {
      piece: pieceToMove.piece,
      from: pieceToMove.square,
      to: targetSquare
    }
    move(moveToPlay)
    setPieceToMove(null)
  }

  const selectPiece = (square) => {
    const piecesColor = square.target.getAttribute("piececolor")
    const wrongPlayer = piecesColor !== playerToMove
    console.log(playerToMove)
    if (wrongPlayer){
      console.log("wrong player")
      return
    }

    const coordinates = square.target.getAttribute("coordinates")
    const possibleMoves = findPossibleMoves(coordinates)
    const selectedPiece = {
      piece: {
        type: square.target.getAttribute("piecetype"),
        color: square.target.getAttribute("piececolor")
      },
      square: coordinates,
      possibleMoves: possibleMoves
    }
    setPieceToMove(selectedPiece)
    // highlightMovesForPiece(selectedPiece.possibleMoves)
  }

  const handleClick = (clickedSquare) => {
    const square = clickedSquare.target.getAttribute("coordinates")
    const squareHasPiece = clickedSquare.target.hasAttribute("pieceType")
    if (!pieceToMove && squareHasPiece){
      selectPiece(clickedSquare)
    }
    if (pieceToMove){
      movePiece(square)
    }
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
                coordinates={square.coordinates}
                className="square"
                piecetype={square.piece ? square.piece.type.toString() : null}
                piececolor={square.piece ? square.piece.color.toString() : null}
                key={square.coordinates} 
                onClick={ (e) => handleClick(e) }
                style={{
                  backgroundColor: square.color === "light" ? "white" : "grey",
                  cursor: square.piece ? "pointer" : ""}}>
                    { square.isPossibleMove && <span className="possible-move"></span> }
                    { square.piece ? pieceSymbols[square.piece.type][square.piece.color] : " "}
                  </td>)}
            </tr>)}
        </tbody>
      </table>
    </>
    )
}