export const getBoard = (board, playerColor) => {
    if (playerColor === "white"){
      return board
    } else {
      const flippedBoard = []
      for (let y = 7; y >= 0; y--){
        const row = []
        for (let x = 7; x >= 0; x--){
          row.push(board[y][x])
        }
        flippedBoard.push(row)
      }
      return flippedBoard 
    }
  }

  export const isMovePromotion = (piece, targetSquare) => {
    if (piece.type !== "pawn"){ return false }
    const targetRow = parseInt(targetSquare[1])
    const pawnColor = piece.color
    const moveIsPromotion = (pawnColor === "white" && targetRow === 8) || (pawnColor === "black" && targetRow === 1)
    return moveIsPromotion
  }