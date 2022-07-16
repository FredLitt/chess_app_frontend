import React, { useState, useEffect } from 'react'
import Chess from './chess'
import Board from './components/Board'
import GameOptionsBar from './components/GameOptionsBar'
import Notation from './components/Notation'
import CapturedPieceContainer from './components/CapturedPieceContainer'
import ModalManager from './components/ModalManager'
import GameOverPopUp from './components/GameOverPopUp'
import gameService from './services/game'
import './App.css'
import { socket } from './context/socket'

const chess = new Chess()

function App() {
  
  // UseReducer for complex state?
  const [ game, setGame ] = useState({ board: null, moveHistory: [], notation: [], capturedPieces: [], playerToMove: null, isOver: false })

  // Idea...
  const [ openModal, setOpenModal ] = useState(null)

  const [ showGameOver, setShowGameOver ] = useState(false)
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
      moveHistory: updatedGame.moveHistory,
      notation: notation, 
      capturedPieces: capturedPieces, 
      playerToMove: playerToMove,
      isOver: isGameOver
    })
  }

  // Upon loading, if a current game is stored, get game from db
  useEffect(() => {
    const currentGameData = localStorage.getItem("CURRENT_GAME_DATA")
    if (currentGameData) {
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
    socket.on("gameUpdate", async () => { getCurrentGame() })
    return () => { 
      socket.off("gameUpdate")
    }
  }, [gameData])

  useEffect(() => { 
    socket.on("opponentResigned", () => { 
      const resigningColor = (gameData.color === "white") ? "black" : "white"
      handleResignation(resigningColor) 
    })
    return () => { socket.off("opponentResigned") }
  })

  const move = async (moveToPlay) => {
    updateGameOptimistically(moveToPlay)
    const updatedGame = await gameService.playMove(gameData.id, moveToPlay)
    updateLocalGameState(updatedGame)
    socket.emit("update", gameData.id)
  }

  // Updates react state using chess logic without waiting for server response
  const updateGameOptimistically = (move) => {
    const isPlayableMove = chess.isPlayableMove(game.board, move)
    if (!isPlayableMove) return
    const fullMove = chess.getFullMove(game.board, move)
    const updatedGame = { moveHistory: [...game.moveHistory, fullMove ]}
    updateLocalGameState(updatedGame)
  }

  const createGame = async (colorChoice) => {
    if (!colorChoice) return console.log("Choose a color!")
    setOpenModal(null)
    const newGame = await gameService.createGame()
    const newGameData = { id: newGame.id, color: colorChoice }
    if (gameData){
      const gameToLeave = gameData.id
      socket.emit("leftGame", gameToLeave)
    }
    socket.emit("joinedGame", newGameData.id)
    localStorage.setItem("CURRENT_GAME_DATA", JSON.stringify(newGameData))
    setGameData(newGameData)
    setOpenModal("createdGameInfo")
  }

  // This is pretty hacky
  const joinGame = (newGameData) => {
    const opponentsColor = newGameData.charAt(newGameData.length-1) 
    const gameID = newGameData.slice(0, newGameData.length-1)
    const color = (opponentsColor === "w") ? "black" : "white"
    const gameToJoin = { id: gameID, color: color }
    if (gameData){ socket.emit("leftGame", gameData.id) }
    socket.emit("joinedGame", gameToJoin.id)
    localStorage.setItem("CURRENT_GAME_DATA", JSON.stringify(gameToJoin))
    setGameData(gameToJoin)
    setOpenModal("joinGame")
  }

  const resign = () => {
    if (!gameData || game.isOver) return
    socket.emit("resign", gameData.id)
    handleResignation(gameData.color)
    setOpenModal(null)
  }

  const handleResignation = (resigningColor) => {
    const result = resigningColor === gameData.color ? "You resigned! Game over!" : "Your opponent resigned! You win!"
    const score = (resigningColor === "white") ? "0-1" : "1-0"
    setGame( {...game, isOver: { result, score }} ) 
    setShowGameOver(true)
  }

  const findPossibleMoves = (square) => { return chess.findSquaresForPiece(game.board, square, "possibleMoves") }

  const highlightMovesForPiece = (possibleMoves) => {
    const highlightedBoard = chess.markPossibleMoves(game.board, possibleMoves)
    setGame( game => ( { ...game, board: highlightedBoard } ))
  }

  const gameInProgress = (game.board !== null)

  const toggleOption = (option) => {
    if (openModal === option) return setOpenModal(null)
    if (openModal) setOpenModal(null)
    setOpenModal(option)
  }

  const modalFunctions = { createGame, joinGame, resign }
  
  return (
    <div className="App">
      <div id="game-container">
        <GameOptionsBar toggleOption={toggleOption} />
        
        {gameInProgress &&
        <Board 
          game={game}
          // board={game.board} 
          // playerToMove={game.playerToMove} 
          // isGameOver={game.isOver}
          move={move} 
          findPossibleMoves={findPossibleMoves} 
          highlightMovesForPiece={highlightMovesForPiece} 
          playerColor={gameData ? gameData.color : null}/>}
        
        {gameInProgress &&
        <div id="notation-captured-piece-container">
          <CapturedPieceContainer color={gameData.color === "white" ? "white" : "black"} pieces={game.capturedPieces} />
          <Notation notation={game.notation}></Notation>
          <CapturedPieceContainer color={gameData.color === "white" ? "black" : "white"} pieces={game.capturedPieces} />
        </div>}
        
      </div>
      <ModalManager 
        openModal={openModal} 
        modalFunctions={modalFunctions}
        gameData={gameData} 
        closePopUp={() => setOpenModal(null)}/>

      {showGameOver && <GameOverPopUp gameOver={game.isOver} toggleCreateGame={() => setOpenModal("createGame")} closePopUp={() => setShowGameOver(false)}/>}
    </div>
  );
}

export default App;
