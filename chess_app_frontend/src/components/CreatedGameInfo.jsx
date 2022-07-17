import React from 'react'
import ClosePopUpButton from './ClosePopUpButton'

export default function CreatedGameInfo({ gameData, closePopUp }) {

    const gameID = `${gameData.id}${gameData.color[0]}`

  return (
    <div className="popup" unselectable='on'>
      <ClosePopUpButton closePopUp={closePopUp} />
      <div>Send the game ID to a friend for them to join</div>
      <div>
          <div>{gameData.id}{gameData.color[0]}</div><button id="copy-button" onClick={() => navigator.clipboard.writeText(gameID)}>Copy</button>
      </div>
      </div>
  )
}
