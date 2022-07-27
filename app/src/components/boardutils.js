const getBoard = (board, playerColor) => {
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

const isMovePromotion = (piece, targetSquare) => {
    if (piece.type !== "pawn"){ return false }
    const targetRow = parseInt(targetSquare[1])
    const pawnColor = piece.color
    const moveIsPromotion = (pawnColor === "white" && targetRow === 8) || (pawnColor === "black" && targetRow === 1)
    return moveIsPromotion
}

const isBottomRowSquare = (playerColor, square) => {
    return (playerColor === "white" && square.coordinates[1] === "1") || (playerColor === "black" && square.coordinates[1] === "8")
}

const isLeftColumnSquare = (playerColor, square) => {
    return (playerColor === "white" && square.coordinates[0] === "a") || (playerColor === "black" && square.coordinates[0] === "h")
}

  export { getBoard, isMovePromotion, isBottomRowSquare, isLeftColumnSquare } 