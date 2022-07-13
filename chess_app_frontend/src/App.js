import React, { useState, useEffect } from 'react'
import Chess from './chess'
import Board from './components/Board'
import GameOptionsBar from './components/GameOptionsBar'
import Notation from './components/Notation'
import CapturedPieceContainer from './components/CapturedPieceContainer'
import CreateGamePopUp from './components/CreateGamePopUp'
import CreatedGameInfo from './components/CreatedGameInfo'
import JoinGamePopUp from './components/JoinGamePopUp'
import ConfirmResignationPopUp from './components/ConfirmResignationPopUp'
import GameOverPopUp from './components/GameOverPopUp'
import gameService from './services/game'
import './App.css'
import { socket } from './context/socket'

const chess = new Chess()

function App() {
  
  // UseReducer for complex state?
  const [ game, setGame ] = useState({ board: null, notation: [], capturedPieces: [], playerToMove: null, isOver: false })

  const [ showCreateGame, setShowCreateGame ] = useState(false)
  const [ showCreatedGameInfo, setShowCreatedGameInfo ] = useState(false)
  const [ showJoinGame, setShowJoinGame ] = useState(false)
  const [ showConfirmResignation, setShowConfirmResignation ] = useState(false)
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
    const newGameData = { id: newGame.id, color: colorChoice }
    if (gameData){
      const gameToLeave = gameData.id
      socket.emit("leftGame", gameToLeave)
    }
    socket.emit("joinedGame", newGameData.id)
    localStorage.setItem("CURRENT_GAME_DATA", JSON.stringify(newGameData))
    setGameData(newGameData)
    setShowCreatedGameInfo(newGameData)
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
    setShowJoinGame(!showJoinGame)
  }

  const resign = () => {
    if (!gameData || game.isOver) return
    socket.emit("resign", gameData.id)
    handleResignation(gameData.color)
    setShowConfirmResignation(false)
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
  
  return (
    <div className="App">
      <div id="game-container">
        <GameOptionsBar 
          toggleCreateGame={() => setShowCreateGame(!showCreateGame)} 
          toggleJoinGame={() => setShowJoinGame(!showJoinGame)} 
          toggleConfirmResignation={
            () => {
              if (game.isOver) return
              setShowConfirmResignation(!showConfirmResignation)}
          } 
          resign={resign} 
          takeback={takebackMove}/>
        
        {gameInProgress &&
        <Board 
          board={game.board} 
          playerToMove={game.playerToMove} 
          isGameOver={game.isOver}
          move={move} 
          findPossibleMoves={findPossibleMoves} 
          highlightMovesForPiece={highlightMovesForPiece} 
          playerColor={gameData ? gameData.color : null}/>}
        
        {gameInProgress &&
        <div id="notation-captured-piece-container">
          <CapturedPieceContainer color={gameData && gameData.color === "white" ? "white" : "black"} pieces={game.capturedPieces} />
          <Notation notation={game.notation}></Notation>
          <CapturedPieceContainer color={gameData && gameData.color === "white" ? "black" : "white"} pieces={game.capturedPieces} />
        </div>}
        
      </div>
      {showCreateGame && <CreateGamePopUp createGame={createGame} closePopUp={() => setShowCreateGame(false)}/>}
      {showCreatedGameInfo && <CreatedGameInfo gameData={gameData} closePopUp={() => setShowCreatedGameInfo(false)}/>}
      {showJoinGame && <JoinGamePopUp joinGame={joinGame} closePopUp={() => setShowJoinGame(false)}/>}
      {showConfirmResignation && <ConfirmResignationPopUp resign={resign} closePopUp={() => setShowConfirmResignation(false)}/>}
      {showGameOver && <GameOverPopUp gameOver={game.isOver} toggleCreateGame={() => setShowCreateGame(true)} closePopUp={() => setShowGameOver(false)}/>}
    </div>
  );
}

export default App;
