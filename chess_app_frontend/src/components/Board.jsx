import React, { useState } from "react";
import { getBoard, isMovePromotion, isBottomRowSquare, isLeftColumnSquare } from "./boardutils"
import pieceSymbols from "../pieceSymbols";
import pieceSVGs from "../pieceSVGs";
import PromotionModal from "./PromotionModal";

export default function Board({board, playerToMove, isGameOver, move, findPossibleMoves, highlightMovesForPiece, playerColor, lastMove}){

  const [ pieceToMove, setPieceToMove ] = useState(null)
  const [ promotionMove, setPromotionMove ] = useState(false)

  const lastPlayedMoveSquares = lastMove? [ lastMove.from, lastMove.to] : []

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
    const wrongColor = (playerColor !== playerToMove) || (piece.color !== playerColor)
    if (wrongColor || isGameOver) return
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
    const squareHasPiece = piece
    if (!pieceToMove && squareHasPiece) selectPiece(coordinates, piece)
    if (pieceToMove) movePiece(coordinates)
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
        {getBoard(board, playerColor).map((row, index) =>
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
                  opacity: lastPlayedMoveSquares.includes(square.coordinates) ? "70%" : "100%",
                  cursor: square.piece ? "pointer" : ""}}>
                    { square.isPossibleMove && <span className="possible-move"></span> }
                    { isBottomRowSquare(playerColor, square) && <span id="x-coords">{square.coordinates[0]}</span>}
                    { isLeftColumnSquare(playerColor, square) && <span id="y-coords">{square.coordinates[1]}</span>}
                    { square.piece ? <img 
                      className="piece-icon"
                      src={pieceSVGs[square.piece.type][square.piece.color]} 
                      alt={pieceSymbols[square.piece.type][square.piece.color]}></img> : " "}
                  </td>)}
            </tr>)}
        </tbody>
      </table>
    </>
    )
}