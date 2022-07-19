import React, { useState, useEffect } from 'react'
import Chess from './chess'
import Board from './components/Board'
import GameOptionsBar from './components/GameOptionsBar'
import Notation from './components/Notation'
import CapturedPieceContainer from './components/CapturedPieceContainer'
import Modals from './components/Modals'
import gameService from './services/game'
import './App.css'
import { socket } from './context/socket'

const chess = new Chess()

function App() {
  
  // UseReducer for complex state?
  const [ game, setGame ] = useState({ board: null, moveHistory: [], notation: [], capturedPieces: [], playerToMove: null, isOver: false })

  const [ openModal, setOpenModal ] = useState(null)

  const [ gameData, setGameData ] = useState( { id: null, color: null }) 

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
    if (isGameOver){ 
      console.log(isGameOver)
      setOpenModal("gameOver")
    }
  }

  // Upon loading, if a current game is stored, get game from db
  useEffect(() => {
    const isCurrentGame = localStorage.getItem("CURRENT_GAME_DATA")
    if (isCurrentGame) {
      const currentGameData = JSON.parse(localStorage.getItem("CURRENT_GAME_DATA"))
      setGameData(currentGameData)
      socket.emit("joinGame", currentGameData.id)
    }
  }, [])

  // if the local gameID state is changed, retrieves new game from database
  useEffect(() => { 
    if (gameData.id === null) return
    const getCurrentGame = async () => {
      const updatedGame = await gameService.getGame(gameData.id)
      if (updatedGame.error) return setOpenModal("error")
      updateLocalGameState(updatedGame)
    } 
    getCurrentGame()
    socket.on("gameUpdate", async () => getCurrentGame())
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

  useEffect(() => {
    socket.on("requestColor", (joiningPlayerID) => {
      const opponentsColor = gameData.color === "white" ? "black" : "white"
      const joiningPlayerData = { 
        playerID: joiningPlayerID, 
        gameID: gameData.id, 
        color: opponentsColor 
      }
      socket.emit("assignColor", joiningPlayerData)
    })
    return () => { socket.off("requestColor") }
  })

  useEffect(() => {
    socket.on("joinGame", (gameData) => {
      localStorage.setItem("CURRENT_GAME_DATA", JSON.stringify(gameData))
      setGameData(gameData)
    })
    return () => { socket.off("joinGame") }
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
    if (!colorChoice) return
    setOpenModal(null)
    const newGame = await gameService.createGame()
    const newGameData = { id: newGame.id, color: colorChoice }
    if (gameData.id){
      const gameToLeave = gameData.id
      socket.emit("leftGame", gameToLeave)
    }
    socket.emit("createdGame", newGameData)
    localStorage.setItem("CURRENT_GAME_DATA", JSON.stringify(newGameData))
    setGameData(newGameData)
    setOpenModal("createdGameInfo")
  }

  const joinGame = async (gameID) => {
    if (gameData){ socket.emit("leftGame", gameData.id) }
    socket.emit("requestJoinGame", gameID)
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
    setOpenModal("gameOver")
  }

  const findPossibleMoves = (square) => { return chess.findSquaresForPiece(game.board, square, "possibleMoves") }

  const highlightMovesForPiece = (possibleMoves) => {
    const highlightedBoard = chess.markPossibleMoves(game.board, possibleMoves)
    setGame( game => ( { ...game, board: highlightedBoard } ))
  }

  const gameInProgress = (game.board !== null)

  const toggleOption = (option) => {
    if (openModal === option) return setOpenModal(null)
    setOpenModal(option)
  }

  const modalFunctions = { createGame, joinGame, resign, toggleOption }

  return (
    <div className="App">
      
      <div id="game-container">
        
        <GameOptionsBar toggleOption={toggleOption} />
        
        {gameInProgress &&
        <Board 
          game={game}
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
      <Modals 
        openModal={openModal} 
        modalFunctions={modalFunctions}
        gameID={gameData.id} 
        gameOver={game.isOver}
        closeModal={() => setOpenModal(null)} />
    </div>
  );
}

export default App;
