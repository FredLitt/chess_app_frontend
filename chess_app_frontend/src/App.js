import React, { useState, useEffect } from 'react'
import Chess from './chess'
import Board from './components/Board'
import GameOptionsBar from './components/GameOptionsBar'
import Notation from './components/Notation'
import CapturedPieceContainer from './components/CapturedPieceContainer'
import CreateGameModal from './components/CreateGameModal'
import NewGameModal from './components/NewGameModal'
import gameService from './services/game'
import './App.css'
import { socket } from './context/socket'

const chess = new Chess()

function App() {
  
  // UseReducer for complex state?
  const [ game, setGame ] = useState({ board: [], notation: [], capturedPieces: [] })
  const [ gameOver, setGameOver ] = useState(false)
  const [ openCreateGame, setOpenCreateGame ] = useState(false)
  const [ playerColor, setPlayerColor ] = useState(null)
  const [ gameID, setGameID ] = useState(null)

  // Gets the most current game from the database and updates React state
  const getGame = async (id) => {
    const updatedGame = await gameService.getGame(id)
    updateLocalGameState(updatedGame)
  } 

  // Takes in a game state to update React state
  const updateLocalGameState = (updatedGame) => {
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
    const currentGameID = JSON.parse(localStorage.getItem('CURRENT_GAME_ID'))
    console.log(currentGameID)
    if (currentGameID) {
      console.log("current game id:", currentGameID)
      setGameID(currentGameID)
    }
    console.log(gameID)
  }, [])

  useEffect(() => {
    localStorage.setItem('CURRENT_GAME_ID', JSON.stringify(gameID))
    const currentGameID = localStorage.getItem('CURRENT_GAME_ID')
    console.log(currentGameID)
    getGame(gameID)
    socket.on("update", async () => {
      getGame(gameID)
    })
  }, [gameID])

  const move = async (moveToPlay) => {
    const updatedGame = await gameService.playMove(gameID, moveToPlay)
    updateLocalGameState(updatedGame)
    socket.emit("update")
  }

  // This should now create a popup for the other player, allowing them to give you a takeback...
  const takebackMove = async (gameID) => {
    const updatedGame = await gameService.takebackMove(gameID)
    updateLocalGameState(updatedGame)
    socket.emit("update")
  }

  const toggleCreateGame = () => {
    if (gameOver) setGameOver(false)
    setOpenCreateGame(true)
  }

  const createGame = async () => {
    if (!playerColor) return console.log("select color!")
    setOpenCreateGame(false)
    const newGame = await gameService.createGame()
    setGameID(newGame.id)
    await getGame(newGame.id)
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
      <div style={{color: "white"}}>{gameID}</div>
      <div id="game-container">
        <GameOptionsBar toggleCreateGame={toggleCreateGame} takeback={takebackMove}></GameOptionsBar>
        {openCreateGame && <CreateGameModal selectColor={setPlayerColor} createGame={createGame} />}
        <Board board={game.board} playerToMove={game.playerToMove} move={move} findPossibleMoves={findPossibleMoves} highlightMovesForPiece={highlightMovesForPiece} />
        <div id="notation-captured-piece-container">
          <CapturedPieceContainer color="white" pieces={game.capturedPieces} />
          <Notation notation={game.notation}></Notation>
          <CapturedPieceContainer color="black" pieces={game.capturedPieces} />
        </div>
        
      </div>
      {gameOver && <NewGameModal gameOver={gameOver} toggleCreateGame={toggleCreateGame} />}
    </div>
  );
}

export default App;
