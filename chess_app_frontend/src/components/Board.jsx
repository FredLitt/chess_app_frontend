import React, { useState } from "react";
import pieceSymbols from "../pieceSymbols"
import PromotionModal from "./PromotionModal";

export default function Board({board, playerToMove, move, findPossibleMoves, highlightMovesForPiece, playerColor}){

  const [ pieceToMove, setPieceToMove ] = useState(null)

  const [ promotionMove, setPromotionMove ] = useState(false)

  const movePiece = (targetSquare) => {
    highlightMovesForPiece([])
    const moveToPlay = {
      piece: pieceToMove.piece,
      from: pieceToMove.square,
      to: targetSquare
    }
    if (isMovePromotion(moveToPlay.piece, targetSquare)){
      setPromotionMove({
          piece: pieceToMove.piece,
          from: pieceToMove.square,
          to: targetSquare
        })
      return
    }
    move(moveToPlay)
    setPieceToMove(null)
  }

  const selectPiece = (coordinates, piece) => {
    const wrongPlayer = piece.color !== playerToMove
    if (wrongPlayer){
      return
    }
    const possibleMoves = findPossibleMoves(coordinates)
    const selectedPiece = {
      piece,
      square: coordinates,
      possibleMoves: possibleMoves
    }
    setPieceToMove(selectedPiece)
    highlightMovesForPiece(selectedPiece.possibleMoves)
  }

  const handleClick = ({ coordinates, piece }) => {
    if (!pieceToMove && piece){
      selectPiece(coordinates, piece)
    }
    if (pieceToMove){
      movePiece(coordinates)
    }
  }

  const isMovePromotion = (piece, targetSquare) => {
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

 const getBoard = () => {
  console.log(playerColor)
    if (playerColor === "black"){
      const flippedBoard = []
      for (let i = 7; i >= 0; i--){
        flippedBoard.push(board[i])
      }
      console.log(flippedBoard)
      return flippedBoard 
    }
    return board
  }

  return (
    <>
      {promotionMove && <PromotionModal promotionMove={promotionMove} promote={promote}/>}

      <table 
        id="board"
        cellSpacing="0">
        <tbody>
        {getBoard().map((row, index) =>
          <tr 
            className="board-row"
            key={index}>
            {row.map((square) => 
              <td 
                className="square"
                key={square.coordinates} 
                onClick={ () => handleClick({ coordinates: square.coordinates, piece: square.piece }) }
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