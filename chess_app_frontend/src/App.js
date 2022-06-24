import React, { useState, useEffect } from 'react'
import Chess from './chess'
import Board from './components/Board'
import GameOptionsBar from './components/GameOptionsBar'
import Notation from './components/Notation'
import CapturedPieceContainer from './components/CapturedPieceContainer'
import NewGameModal from './components/NewGameModal'
import gameService from './services/game'
import './App.css'

function App() {

  // UseReducer for complex state?
  const [ game, setGame ] = useState({ board: [], notation: [], capturedPieces: [] })
  const [ gameOver, setGameOver ] = useState(false)

  const getGame = async () => {
    const chess = new Chess()
    const updatedGame = await gameService.getGame()
    const updatedBoard = chess.createBoardFromMoveHistory(updatedGame.moveHistory)
    const notation = chess.getMoveNotation(updatedGame.moveHistory)
    const capturedPieces = chess.getCapturedPieces(updatedBoard)
    const playerToMove = chess.getWhoseTurn(updatedGame.moveHistory)
    setGame({ 
      board: updatedBoard, 
      notation: notation, 
      capturedPieces: capturedPieces, 
      playerToMove: playerToMove 
    })
    const gameResult = chess.isGameOver(updatedBoard)
    if (gameResult) { 
      console.log("game over!")
      setGameOver(gameResult) }
  }

  useEffect(() => {
    getGame()
  }, [])

  const move = async (moveToPlay) => {
    await gameService.playMove(moveToPlay)
    getGame()
  }

  const takebackMove = async () => {
    await gameService.takebackMove()
    getGame()
  }

  const startNewGame = async () => {
    if (gameOver){setGameOver(false)}
    await gameService.startNewGame()
    getGame()
  }

  const findPossibleMoves = (square) => {
    const chess = new Chess()
    return chess.findSquaresForPiece(game.board, square, "possible moves")
  }

  const highlightMovesForPiece = (possibleMoves) => {
    const chess = new Chess()
    const highlightedBoard = chess.markPossibleMoves(game.board, possibleMoves)
    setGame( game => ( { ...game, board: highlightedBoard } ))
  }

  return (
    <div className="App">
      <div id="game-container">
        <GameOptionsBar startNewGame={startNewGame} takeback={takebackMove}></GameOptionsBar>
        <Board board={game.board} playerToMove={game.playerToMove} move={move} findPossibleMoves={findPossibleMoves} highlightMovesForPiece={highlightMovesForPiece}/>
        <div id="notation-captured-piece-container">
          <CapturedPieceContainer color="white" pieces={game.capturedPieces}/>
          <Notation notation={game.notation}></Notation>
          <CapturedPieceContainer color="black" pieces={game.capturedPieces}/>
        </div>
      </div>
      {gameOver && <NewGameModal gameOver={gameOver} startNewGame={startNewGame} />}
    </div>
  );
}

export default App;
