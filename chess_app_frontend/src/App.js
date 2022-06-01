import React, { useState, useEffect } from "react"
import Chess from './chess'
import Board from './components/Board'
import GameOptionsBar from './components/GameOptionsBar'
import Notation from './components/Notation'
import gameService from './services/game'
import './App.css';

// TODO
// [x] - Render a starting position board from a new game in MongoDB
// [x] - Use interface to play a move, have backend validate and update
// [x] - Add gameService to take back move (pop last move)
// [x] - Create a new game (just use current game ID) and clear all moves
// [x] - Fix en passant check issue
// [ ] - Fix isGameOver function
// [ ] - Enable Promotions
// [ ] - Render SAN move list
// [ ] - Render Captured Pieces
// [ ] - Add in custom themes
// [ ] - Front end validation to speed up interface first??

function App() {

  const [ board, setBoard ] = useState([])
  const [ notation, setNotation ] = useState([])

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
    await gameService.playMove(moveToPlay)
    const chess = new Chess()
    const updatedGame = await gameService.getGame()
    const updatedBoard = chess.createBoardFromMoveHistory(updatedGame.moveHistory)
    setBoard(updatedBoard)
    const moveNotation = chess.getMoveNotation(updatedGame.moveHistory)
    setNotation(moveNotation)
  }

  const takebackMove = async () => {
    await gameService.takebackMove()
    const chess = new Chess()
    const updatedGame = await gameService.getGame()
    const updatedBoard = chess.createBoardFromMoveHistory(updatedGame.moveHistory)
    setBoard(updatedBoard)
  }

  const startNewGame = async () => {
    await gameService.startNewGame()
    const chess = new Chess()
    const updatedGame = await gameService.getGame()
    const updatedBoard = chess.createBoardFromMoveHistory(updatedGame.moveHistory)
    setBoard(updatedBoard)
  }

  return (
    <div className="App">
      <GameOptionsBar startNewGame={startNewGame} takeback={takebackMove}></GameOptionsBar>
      <Board board={board} setBoard={setBoard} move={move}/>
      <Notation notation={notation}></Notation>
    </div>
  );
}

export default App;
