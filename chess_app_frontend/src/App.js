import React, { useState, useEffect, useContext } from 'react'
import Chess from './chess'
import Board from './components/Board'
import GameOptionsBar from './components/GameOptionsBar'
import Notation from './components/Notation'
import CapturedPieceContainer from './components/CapturedPieceContainer'
import NewGameModal from './components/NewGameModal'
import gameService from './services/game'
import './App.css'
//import { SocketContext, socket } from './context/socket'

const chess = new Chess()

function App() {
  
  // UseReducer for complex state?
  const [ game, setGame ] = useState({ board: [], notation: [], capturedPieces: [] })
  const [ gameOver, setGameOver ] = useState(false)

  // Gets the most current game from the database and updates React state
  const getGame = async () => {
    const updatedGame = await gameService.getGame()
    updateLocalGameState(updatedGame)
  }

  // Takes in a game state to update React state
  const updateLocalGameState = (updatedGame) => {
    const updatedBoard = chess.createBoardFromMoveHistory(updatedGame.moveHistory)
    const notation = chess.getMoveNotation(updatedGame.moveHistory)
    console.log("moves:", updatedGame.moveHistory, "notation:" + notation)
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
    const updatedGame = await gameService.playMove(moveToPlay)
    updateLocalGameState(updatedGame)
    //socket.emit("move")
  }

  const takebackMove = async () => {
    const updatedGame = await gameService.takebackMove()
    console.log(updatedGame)
    updateLocalGameState(updatedGame)
  }

  const startNewGame = async () => {
    if (gameOver){setGameOver(false)}
    const updatedGame = await gameService.startNewGame()
    updateLocalGameState(updatedGame)
  }

  const findPossibleMoves = (square) => {
    return chess.findSquaresForPiece(game.board, square, "possible moves")
  }

  const highlightMovesForPiece = (possibleMoves) => {
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
