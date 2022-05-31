import React, { useState, useEffect } from "react"
import Chess from './chess'
import Board from './components/Board'
import GameOptionsBar from './components/GameOptionsBar'
import gameService from './services/game'
import './App.css';

// TODO
// [x] - Render a starting position board from a new game in MongoDB
// [x] - Use interface to play a move, have backend validate and update
// [x] - Add gameService to take back move (pop last move)
// [ ] - Create a new game (just use current game ID) and clear all moves
// [ ] - Fix en passant check issue
// [ ] - Fix isGameOver function
// [ ] - Front end validation to speed up interface first??

function App() {

  const [ board, setBoard ] = useState([])

  useEffect(() => {
    const getGame = async () => {
      const chess = new Chess()
      const gameData = await gameService.getGame()
      const board = chess.createBoardFromMoveHistory(gameData.moveHistory)
      if (board) {
        setBoard(board)
      } else {
        setBoard(chess.createStartPosition())
      }
    }
    getGame()
  }, [])

  const move = async (moveToPlay) => {
    const playedMove = gameService.playMove(moveToPlay)
    const chess = new Chess()
    await playedMove
    const updatedGame = await gameService.getGame()
    await updatedGame
    const updatedBoard = chess.createBoardFromMoveHistory(updatedGame.moveHistory)
    setBoard(updatedBoard)
  }

  const takebackMove = async () => {
    const takeback = await gameService.takebackMove()
    const chess = new Chess()
    await takeback
    const updatedGame = await gameService.getGame()
    await updatedGame
    console.log("updated game:", updatedGame)
    const updatedBoard = chess.createBoardFromMoveHistory(updatedGame.moveHistory)
    setBoard(updatedBoard)
  }

  const startNewGame = async () => {
    const takeback = await gameService.startNewGame()
    const chess = new Chess()
    await takeback
    const updatedGame = await gameService.getGame()
    await updatedGame
    console.log("updated game:", updatedGame)
    const updatedBoard = chess.createBoardFromMoveHistory(updatedGame.moveHistory)
    setBoard(updatedBoard)
  }

  return (
    <div className="App">
      <GameOptionsBar startNewGame={startNewGame} takeback={takebackMove}></GameOptionsBar>
      <Board board={board} setBoard={setBoard} move={move}/>
    </div>
  );
}

export default App;
