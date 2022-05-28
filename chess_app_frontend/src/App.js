import React, { useState, useEffect } from "react"
import Chess from './chess'
import Board from './Board'
import gameService from './services/game'
import axios from 'axios'
import './App.css';

// TODO
// [ ] - Render a starting position board from a new game in MongoDB

// const chess = new Chess()
// const emptyBoard = chess.createEmptyBoard()

function App() {

  const [ board, setBoard ] = useState([])

  useEffect(() => {
    const chess = new Chess()
    gameService
    .getGame()
    .then(gameData => {
      console.log("moves:", gameData.moveHistory)
      const board = chess.createBoardFromMoveHistory(gameData.moveHistory)
      setBoard(board)
    })
  }, [])

  return (
    <div className="App">
      <Board board={board} setBoard={setBoard} />
    </div>
  );
}

export default App;
