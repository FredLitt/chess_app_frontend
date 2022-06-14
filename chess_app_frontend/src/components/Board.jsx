import React, { useState } from "react";
import pieceSymbols from "../pieceSymbols"
import PromotionModal from "./PromotionModal";

export default function Board({board, playerToMove, move, findPossibleMoves, highlightMovesForPiece}){

  const [ pieceToMove, setPieceToMove ] = useState(null)

  const [ promotionMove, setPromotionMove ] = useState(false)

  const movePiece = (targetSquare) => {
    // highlightMovesForPiece([])
    const moveToPlay = {
      piece: pieceToMove.piece,
      from: pieceToMove.square,
      to: targetSquare
    }
    if (checkForPromotion(moveToPlay.piece, targetSquare)){
      setPromotionMove({
          piece: pieceToMove.piece,
          from: pieceToMove.square,
          to: targetSquare
        })
      return
    }
    console.log("React playing move:", moveToPlay)
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
    const squareHasPiece = clickedSquare.target.hasAttribute("piecetype")
    if (!pieceToMove && squareHasPiece){
      selectPiece(clickedSquare)
    }
    if (pieceToMove){
      movePiece(square)
    }
  }

  const checkForPromotion = (piece, targetSquare) => {
    if (piece.type !== "pawn"){ return false }
    const targetRow = parseInt(targetSquare[1])
    const pawnColor = piece.color
    const moveIsPromotion = (pawnColor === "white" && targetRow === 8) || (pawnColor === "black" && targetRow === 1)
    return moveIsPromotion
  }

  const promote = (promotionChoice) => {
    const moveToPlay = {
      piece: promotionMove.piece,
      from: promotionMove.from,
      to: promotionMove.to,
      promotion: promotionChoice
    }
    move(moveToPlay)
    setPromotionMove(false)
    setPieceToMove(null)
  }

  return (
    <>
      {promotionMove && <PromotionModal promotionMove={promotionMove} promote={promote}/>}

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
                  backgroundColor: square.color === "light" ? "var(--light-square)" : "var(--dark-square)",
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