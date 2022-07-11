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
  const [ game, setGame ] = useState({ board: null, notation: [], capturedPieces: [], playerToMove: null, isOver: false })

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
    const currentGameData = localStorage.getItem("CURRENT_GAME_DATA")
    if (typeof currentGameData !== typeof undefined){
      const currentGameData = JSON.parse(localStorage.getItem("CURRENT_GAME_DATA"))
      setGameData(currentGameData)
      socket.emit("joinedGame", currentGameData.id)
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
    socket.on("gameUpdate", async () => {
      getCurrentGame()
    })
    return () => {
      socket.off("gameUpdate")
    }
  }, [gameData])

  const move = async (moveToPlay) => {
    const updatedGame = await gameService.playMove(gameData.id, moveToPlay)
    updateLocalGameState(updatedGame)
    socket.emit("update", gameData.id)
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
    const newGameData = {
      id: newGame.id,
      color: colorChoice
    }
    if (gameData){
      const gameToLeave = gameData.id
      socket.emit("leftGame", gameToLeave)
    }
    socket.emit("joinedGame", newGameData.id)
    localStorage.setItem("CURRENT_GAME_DATA", JSON.stringify(newGameData))
    setGameData(newGameData)
  }

  // Join game should include opponent's color
  const joinGame = (gameID) => {
    const gameToJoin = {
      id: gameID,
      color: "black"
    }
    if (gameData){
      socket.emit("leftGame", gameData.id)
    }
    socket.emit("joinedGame", gameToJoin.id)
    localStorage.setItem("CURRENT_GAME_DATA", JSON.stringify(gameToJoin))
    setGameData(gameToJoin)
    setShowJoinGame(!showJoinGame)
  }

  const findPossibleMoves = (square) => {
    return chess.findSquaresForPiece(game.board, square, "possibleMoves")
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
        {game.board &&
        <Board board={game.board} playerToMove={game.playerToMove} move={move} findPossibleMoves={findPossibleMoves} highlightMovesForPiece={highlightMovesForPiece} playerColor={gameData ? gameData.color : null}/>
        }
        {game.board &&
        <div id="notation-captured-piece-container">
          <CapturedPieceContainer color={gameData && gameData.color === "white" ? "white" : "black"} pieces={game.capturedPieces} />
          <Notation notation={game.notation}></Notation>
          <CapturedPieceContainer color={gameData && gameData.color === "white" ? "black" : "white"} pieces={game.capturedPieces} />
        </div>}
        
      </div>
      {showCreateGame && <CreateGameModal createGame={createGame} />}
      {showJoinGame && <JoinGameInput joinGame={joinGame} />}
      {game.isOver && <NewGameModal gameOver={game.isOver} />}
    </div>
  );
}

export default App;
