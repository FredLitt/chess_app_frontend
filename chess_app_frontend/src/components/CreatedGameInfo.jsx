import React from 'react'
import ClosePopUpButton from './ClosePopUpButton'

export default function CreatedGameInfo({ gameID, closePopUp }) {

  return (
    <div className="modal" unselectable='on'>
      <ClosePopUpButton closePopUp={closePopUp} />
      <div>Send the game ID to a friend for them to join</div>
      <div>
          <div>{gameID}</div><button id="copy-button" onClick={() => navigator.clipboard.writeText(gameID)}>Copy</button>
      </div>
      </div>
  )
}
