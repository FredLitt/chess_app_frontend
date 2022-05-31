import React, { useState, useEffect } from "react"
import Chess from './chess'
import Board from './Board'
import gameService from './services/game'
import axios from 'axios'
import './App.css';

// TODO
// [x] - Render a starting position board from a new game in MongoDB
// [ ] - Use interface to play a move, have backend validate and update
// [ ] - Add gameService to take back move (pop last move)
// [ ] - Create a new game (just use current game ID) and clear all moves

// const chess = new Chess()
// const emptyBoard = chess.createEmptyBoard()


function App() {

  const [ board, setBoard ] = useState([])

  const move = (moveToPlay) => {
    const chess = new Chess()
    console.log("move to play:", moveToPlay)
    gameService
    .updateGame(moveToPlay)
    .then(updatedGameData => {
      console.log("LOL")
      const updatedBoard = chess.createBoardFromMoveHistory(updatedGameData.moveHistory)
      console.table(board)
      setBoard(updatedBoard)
    })
  }

  useEffect(() => {
    const chess = new Chess()
    gameService
    .getGame()
    .then(gameData => {
      const board = chess.createBoardFromMoveHistory(gameData.moveHistory)
      console.log(board)
      setBoard(board)
    })
  }, [])

  return (
    <div className="App">
      <Board board={board} setBoard={setBoard} move={move}/>
    </div>
  );
}

export default App;
