import React, { useState, useCallback, useEffect } from "react"
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
// [x] - Enable Promotions
// [x] - Render SAN move list
// [x] - Render Captured Pieces
// [x] - Add in custom themes
// [ ] - Game over modal
// [ ] - Front end validation to speed up interface first??

function App() {

  // UseReducer for complex state?
  const [ game, setGame ] = useState({ board: [], notation: [], capturedPieces: [] })

  // EVERYTIME PIECE IS SELECTED, EVERYTHING IS RERENDERED DUE TO HIGHLIGHTING
  // USEMEMO OR USECALLBACK TO IMPROVE PERFORMANCE??
  // EVerYTHING RE-RENDERS WHEN A PIECE IS PLAYED AS WELL...
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

  const findPossibleMoves = (square) => {
    const chess = new Chess()
    return chess.findSquaresForPiece(game.board, square, "possible moves")
  }

  // POOR PERFORMANCE... USEMEMO???
  const highlightMovesForPiece = (possibleMoves) => {
    const chess = new Chess()
    const highlightedBoard = chess.markPossibleMoves(game.board, possibleMoves)
    setGame( game => ( { ...game, board: highlightedBoard } ))
    console.log("highlighting moves:", game)
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
    </div>
  );
}

export default App;
