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

export default function Modals({ openModal, modalFunctions, gameID, gameOver, closePopUp }) {

    const { createGame, joinGame, resign, toggleOption } = modalFunctions

  return (
    <>
        {MODALS.CREATEGAME === openModal && <CreateGameModal createGame={createGame} closePopUp={closePopUp} />}
        {MODALS.CREATEDGAMEINFO === openModal && <CreatedGameInfo gameID={gameID} closePopUp={closePopUp} />}
        {MODALS.JOINGAME === openModal && <JoinGameModal joinGame={joinGame} closePopUp={closePopUp} />}
        {MODALS.CONFIRMRESGNATION === openModal && <ConfirmResignationModal resign={resign} closePopUp={closePopUp} />}
        {MODALS.GAMEOVER === openModal && <GameOverModal gameOver={gameOver} toggleCreateGame={() => toggleOption("createGame")} closePopUp={closePopUp} />}
        {MODALS.ERROR === openModal && <ErrorModal closePopUp={closePopUp} />}
    </>
  )
}
