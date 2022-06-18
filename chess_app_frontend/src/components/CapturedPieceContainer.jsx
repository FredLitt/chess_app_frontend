import React from "react";
import pieceSymbols from "../pieceSymbols";

export default function CapturedPieces({color, pieces}){

  console.log("captured pieces:", pieces)

  pieces = pieces.filter(piece => piece.color === color)

  const pieceValues = {
    "queen": 9,
    "rook": 5,
    "bishop": 3.5,
    "knight": 3,
    "pawn": 1
  }

  const sortedPieces = pieces.sort(function(a, b){
    return pieceValues[b.type] - pieceValues[a.type] 
  })

  return (
    <div
      className="captured-pieces">
      {sortedPieces.map((piece, index) => 
        <div key={index}>{pieceSymbols[piece.type][piece.color]}
        </div>)}
    </div>)
}