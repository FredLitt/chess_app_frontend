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

  const chess = new Chess()

  const [ board, setBoard ] = useState([])

  useEffect(() => {
    gameService
    .getGame()
    .then(gameData => {
      console.log("game history:", gameData.moveHistory)
      const board = chess.createBoardFromMoveHistory(gameData.moveHistory)
      if (board){
        setBoard(board)
      } else {
        setBoard(chess.createStartPosition())
      }
    })
  }, [])

  const move = (moveToPlay) => {
    gameService
    .playMove(moveToPlay)
    .then(updatedGame => {
      const updatedBoard = chess.createBoardFromMoveHistory(updatedGame.moveHistory)
      setBoard(updatedBoard)
    })
  }

  const takebackMove = async () => {
    const takeback = await gameService.takebackMove()
    await takeback
    const updatedGame = await gameService.getGame()
    await updatedGame
    console.log("updated game:", updatedGame)
    const updatedBoard = chess.createBoardFromMoveHistory(updatedGame.moveHistory)
    await updatedBoard
    setBoard(updatedBoard)
  }

  const startNewGame = () => {

  }

  return (
    <div className="App">
      <GameOptionsBar startNewGame={startNewGame} takeback={takebackMove}></GameOptionsBar>
      <Board board={board} setBoard={setBoard} move={move}/>
    </div>
  );
}

export default App;
