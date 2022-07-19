import React from 'react'
import CreateGameModal from './CreateGameModal'
import CreatedGameInfo from './CreatedGameInfo'
import JoinGameModal from './JoinGameModal'
import ConfirmResignationModal from './ConfirmResignationModal'
import ErrorModal from './ErrorModal'
import GameOverModal from './GameOverModal'

const MODALS = {
    CREATEGAME: "createGame",
    CREATEDGAMEINFO: "createdGameInfo",
    JOINGAME: "joinGame",
    CONFIRMRESGNATION: "confirmResignation",
    GAMEOVER: "gameOver",
    ERROR: "error"
}

export default function Modals({ openModal, modalFunctions, gameID, gameOver, closeModal }) {

    const { createGame, joinGame, resign, toggleOption } = modalFunctions

  return (
    <>
        {MODALS.CREATEGAME === openModal && <CreateGameModal createGame={createGame} closeModal={closeModal} />}
        {MODALS.CREATEDGAMEINFO === openModal && <CreatedGameInfo gameID={gameID} closeModal={closeModal} />}
        {MODALS.JOINGAME === openModal && <JoinGameModal joinGame={joinGame} closeModal={closeModal} />}
        {MODALS.CONFIRMRESGNATION === openModal && <ConfirmResignationModal resign={resign} closeModal={closeModal} />}
        {MODALS.GAMEOVER === openModal && <GameOverModal gameOver={gameOver} toggleCreateGame={() => toggleOption("createGame")} closeModal={closeModal} />}
        {MODALS.ERROR === openModal && <ErrorModal closeModal={closeModal} />}
    </>
  )
}
