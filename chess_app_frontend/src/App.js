import React, { useState, useEffect } from "react"
import Chess from './chess'
import Board from './components/Board'
import GameOptionsBar from './components/GameOptionsBar'
import Notation from './components/Notation'
import CapturedPieceContainer from "./components/CapturedPieceContainer"
import gameService from './services/game'
import './App.css';

// TODO
// [x] - Render a starting position board from a new game in MongoDB
// [x] - Use interface to play a move, have backend validate and update
// [x] - Add gameService to take back move (pop last move)
// [x] - Create a new game (just use current game ID) and clear all notation
// [x] - Fix en passant check issue
// [x] - Fix isGameOver function
// [ ] - Enable Promotions
// [x] - Render SAN move list
// [ ] - Render Captured Pieces
// [ ] - Add in custom themes
// [ ] - Front end validation to speed up interface first??

function App() {

  const [ game, setGame ] = useState({ board: [], notation: [], capturedPieces: [] })

  const getGame = async () => {
    const chess = new Chess()
    const updatedGame = await gameService.getGame()
    const updatedBoard = chess.createBoardFromMoveHistory(updatedGame.moveHistory)
    const notation = chess.getMoveNotation(updatedGame.moveHistory)
    const capturedPieces = chess.getCapturedPieces(updatedBoard)
    setGame( { board: updatedBoard, notation: notation, capturedPieces: capturedPieces } )
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
    await gameService.startNewGame()
    getGame()
  }

  return (
    <div className="App">
      <GameOptionsBar startNewGame={startNewGame} takeback={takebackMove}></GameOptionsBar>
      <div id="game-container">
        <Board board={game.board} move={move}/>
        <div id="notation-captured-piece-container">
          <CapturedPieceContainer color="white" pieces={game.capturedPieces}/>
          <Notation notation={game.notation}></Notation>
          <CapturedPieceContainer color="black" pieces={game.capturedPieces}/>
        </div>
      </div>
    </div>
  );
}

export default App;

