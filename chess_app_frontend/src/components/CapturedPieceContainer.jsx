import React from "react";
import pieceSVGs from "../pieceSVGs";
import pieceSymbols from "../pieceSymbols";

export default function CapturedPieces({color, pieces}){

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
        <img src={pieceSVGs[piece.type][piece.color]} alt={pieceSymbols[piece.type][piece.color]} key={index}></img>)}
    </div>)
}