import React, { useState, useEffect } from 'react'
import Chess from './chess'
import Board from './components/Board'
import GameOptionsBar from './components/GameOptionsBar'
import Notation from './components/Notation'
import CapturedPieceContainer from './components/CapturedPieceContainer'
import CreateGameModal from './components/CreateGameModal'
import JoinGameInput from './components/JoinGameInput'
import NewGameModal from './components/NewGameModal'
import gameService from './services/game'
import './App.css'
import { socket } from './context/socket'

const chess = new Chess()

function App() {
  
  // UseReducer for complex state?
  const [ game, setGame ] = useState({ board: [], notation: [], capturedPieces: [], playerToMove: null })

  const [ showCreateGame, setShowCreateGame ] = useState(false)
  const [ showJoinGame, setShowJoinGame ] = useState(false)
  const [ gameOver, setGameOver ] = useState(false)
  const [ gameID, setGameID ] = useState(null)


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

  // Upon loading, if a current game is stored, get game from db
  useEffect(() => {
    const currentGameID = JSON.parse(localStorage.getItem("CURRENT_GAME_ID"))
    if (currentGameID !== null) {
      setGameID(currentGameID)
    }
  }, [])

  // if the local gameID state is changed, retrieves new game from database
  useEffect(() => { 
    if (!gameID){return}
    // Gets the most current game from the database and updates React state
    const getCurrentGame = async () => {
      const updatedGame = await gameService.getGame(gameID)
      updateLocalGameState(updatedGame)
    } 
    getCurrentGame()
    socket.on("update", async () => {
      getCurrentGame()
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

  // Delete previous game upon creation of new game?
  const createGame = async (colorChoice) => {
    if (!colorChoice) return console.log("Choose a color!")
    setShowCreateGame(false)
    const newGame = await gameService.createGame()
    localStorage.removeItem("CURRENT_GAME_ID")
    localStorage.setItem("CURRENT_GAME_ID", JSON.stringify(newGame.id))
    setGameID(newGame.id)
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
        <GameOptionsBar toggleCreateGame={() => setShowCreateGame(!showCreateGame)} toggleJoinGame={() => setShowJoinGame(!showJoinGame)} takeback={takebackMove}></GameOptionsBar>
        <Board board={game.board} playerToMove={game.playerToMove} move={move} findPossibleMoves={findPossibleMoves} highlightMovesForPiece={highlightMovesForPiece} />

        <div id="notation-captured-piece-container">
          <CapturedPieceContainer color="white" pieces={game.capturedPieces} />
          <Notation notation={game.notation}></Notation>
          <CapturedPieceContainer color="black" pieces={game.capturedPieces} />
        </div>
        
      </div>
      {showCreateGame && <CreateGameModal createGame={createGame} />}
      {showJoinGame && <JoinGameInput joinGame={(id) => setGameID(id)} />}
      {gameOver && <NewGameModal gameOver={gameOver} />}
    </div>
  );
}

export default App;
