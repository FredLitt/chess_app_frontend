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
  const [ game, setGame ] = useState({ board: [], notation: [], capturedPieces: [], playerToMove: null, isOver: false })

  const [ showCreateGame, setShowCreateGame ] = useState(false)
  const [ showJoinGame, setShowJoinGame ] = useState(false)
  const [ gameData, setGameData ] = useState(null) 

  // Takes in a game state to update React state
  const updateLocalGameState = (updatedGame) => {
    const updatedBoard = chess.createBoardFromMoveHistory(updatedGame.moveHistory)
    const notation = chess.getMoveNotation(updatedGame.moveHistory)
    const capturedPieces = chess.getCapturedPieces(updatedBoard)
    const playerToMove = chess.getWhoseTurn(updatedGame.moveHistory)
    const isGameOver = chess.isGameOver(updatedBoard)
    setGame({ 
      board: updatedBoard, 
      notation: notation, 
      capturedPieces: capturedPieces, 
      playerToMove: playerToMove,
      isOver: isGameOver
    })
  }

  // Upon loading, if a current game is stored, get game from db
  useEffect(() => {
    const currentGameID = localStorage.getItem("CURRENT_GAME_ID")
    if (typeof currentGameID !== typeof undefined){
      const currentGameData = {
        id: JSON.parse(localStorage.getItem("CURRENT_GAME_ID")),
        color: JSON.parse(localStorage.getItem("CURRENT_GAME_COLOR"))
      }
      console.log(currentGameData)
      setGameData(currentGameData)
    }
  }, [])

  // if the local gameID state is changed, retrieves new game from database
  useEffect(() => { 
    if (gameData === null) return
    const getCurrentGame = async () => {
      const updatedGame = await gameService.getGame(gameData.id)
      updateLocalGameState(updatedGame)
    } 
    getCurrentGame()
    // socket.on("update", async () => {
    //   getCurrentGame()
    // })
  }, [gameData])

  const move = async (moveToPlay) => {
    if (gameData.color !== game.playerToMove) return console.log("not your pieces!")
    const updatedGame = await gameService.playMove(gameData.id, moveToPlay)
    updateLocalGameState(updatedGame)
    //socket.emit("update")
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
    const gameData = {
      id: newGame.id,
      color: colorChoice
    }
    setGameData(gameData)
    updateLocalGameData(gameData)
  }

  // For now just create game with white and default to black for joining player 
  const joinGame = (gameID) => {
    const gameData = {
      id: gameID,
      color: "black"
    }
    setGameData(gameData)
    updateLocalGameData(gameData)
    setShowJoinGame(!showJoinGame)
  }

  // Refactor to store in a single key value pair?
  const updateLocalGameData = (gameData) => {
    const { id, color } = gameData
    localStorage.removeItem("CURRENT_GAME_ID")
    localStorage.removeItem("CURRENT_GAME_COLOR")
    localStorage.setItem("CURRENT_GAME_ID", JSON.stringify(id))
    localStorage.setItem("CURRENT_GAME_COLOR", JSON.stringify(color))
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
      {gameData && <div style={{color: "white"}}>{gameData.id}</div>}
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
      {showJoinGame && <JoinGameInput joinGame={joinGame} />}
      {game.isOver && <NewGameModal gameOver={game.isOver} />}
    </div>
  );
}

export default App;
