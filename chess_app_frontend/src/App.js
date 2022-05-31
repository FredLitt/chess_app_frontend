import React, { useState, useEffect } from "react"
import Chess from './chess'
import Board from './components/Board'
import GameOptionsBar from './components/GameOptionsBar'
import gameService from './services/game'
import './App.css';

// TODO
// [x] - Render a starting position board from a new game in MongoDB
// [x] - Use interface to play a move, have backend validate and update
// [ ] - Add gameService to take back move (pop last move)
// [ ] - Create a new game (just use current game ID) and clear all moves
// [ ] - Fix en passant check issue
// [ ] - Fix isGameOver function

function App() {

  const [ board, setBoard ] = useState([])

  const chess = new Chess()

  useEffect(() => {
    gameService
    .getGame()
    .then(gameData => {
      const board = chess.createBoardFromMoveHistory(gameData.moveHistory)
      setBoard(board)
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

  const undoMove = () => {
    gameService
    .undoMove()
    .then(gameService
      .getGame()
      .then(gameData => {
        const board = chess.createBoardFromMoveHistory(gameData.moveHistory)
        setBoard(board)
      })
    )
  }

  return (
    <div className="App">
      <GameOptionsBar takeback={undoMove}></GameOptionsBar>
      <Board board={board} setBoard={setBoard} move={move}/>
    </div>
  );
}

export default App;
