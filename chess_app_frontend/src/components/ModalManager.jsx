import React from 'react'
import CreateGamePopUp from './CreateGamePopUp'
import CreatedGameInfo from './CreatedGameInfo'
import JoinGamePopUp from './JoinGamePopUp'
import ConfirmResignationPopUp from './ConfirmResignationPopUp'
import GameOverPopUp from './GameOverPopUp'

const MODALS = {
    CREATEGAME: "createGame",
    CREATEDGAMEINFO: "createdGameInfo",
    JOINGAME: "joinGame",
    CONFIRMRESGNATION: "confirmResignation" 
}

export default function ModalManager({ openModal, modalFunctions, gameData, closePopUp }) {

    const {createGame, joinGame, resign} = modalFunctions

  return (
    <>
        {MODALS.CREATEGAME === openModal && <CreateGamePopUp createGame={createGame} closePopUp={closePopUp} />}
        {MODALS.CREATEDGAMEINFO === openModal && <CreatedGameInfo gameData={gameData} closePopUp={closePopUp} />}
        {MODALS.JOINGAME === openModal && <JoinGamePopUp joinGame={joinGame} closePopUp={closePopUp} />}
        {MODALS.CONFIRMRESGNATION === openModal && <ConfirmResignationPopUp resign={resign} closePopUp={closePopUp} />}
    </>
  )
}
