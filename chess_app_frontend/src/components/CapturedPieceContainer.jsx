import React from "react";
import pieceSymbols from "../pieceSymbols";

export default function CapturedPieces({color, pieces}){

  // console.log(pieces)
  // pieces.forEach(piece => console.log(pieceSymbols[piece.type][piece.color]))
  // pieces.forEach(piece => console.log(piece))
  
  // const pieceValues = {
  //   "queen": 9,
  //   "rook": 5,
  //   "bishop": 3.5,
  //   "knight": 3,
  //   "pawn": 1
  // }

  // const sortedPieces = pieces.sort(function(a, b){
  //   return pieceValues[b.type] - pieceValues[a.type] 
  // })

  return (
    <div
      className="captured-pieces">
      {/* {pieces.map((piece, index) => 
        <div key={index}>{pieceSymbols[piece.type][piece.color]}
        </div>)} */}
    </div>)
}