import React, { useState } from "react";
import pieceSymbols from "../pieceSymbols"
import PromotionModal from "./PromotionModal";

export default function Board({board, playerToMove, move, findPossibleMoves, highlightMovesForPiece}){
  console.log("rendering board")
  const [ pieceToMove, setPieceToMove ] = useState(null)

  const [ pawnIsPromoting, setPawnIsPromoting ] = useState(false)

  const movePiece = (targetSquare) => {
    // highlightMovesForPiece([])
    const moveToPlay = {
      piece: pieceToMove.piece,
      from: pieceToMove.square,
      to: targetSquare
    }
    if (checkForPromotion(moveToPlay.piece, targetSquare)){
      setPawnIsPromoting(true)
      return
    }
    move(moveToPlay)
    setPieceToMove(null)
  }

  const selectPiece = (square) => {
    const piecesColor = square.target.getAttribute("piececolor")
    const wrongPlayer = piecesColor !== playerToMove
    if (wrongPlayer){
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
    //highlightMovesForPiece(selectedPiece.possibleMoves)
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

  const checkForPromotion = (piece, targetSquare) => {
    if (piece.type !== "pawn"){
      return false
    }
    const targetRow = parseInt(targetSquare[1])
    const pawnColor = piece.color
    const pawnIsPromoting = pawnColor === "white" && targetRow === 8 || pawnColor === "black" && targetRow === 1
    if (pawnIsPromoting){
      console.log("pawn is promoting")
      return true
    }
    return false
  }

  const promote = () => {
    console.log("yay for promotions!")
  }

  return (
    <>
      {pawnIsPromoting && <PromotionModal promote={promote}/>}
      
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