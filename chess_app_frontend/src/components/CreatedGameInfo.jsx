import React from 'react'
import CloseModalButton from './CloseModalButton'

export default function CreatedGameInfo({ gameID, closeModal }) {

  return (
    <div className="modal">
      <CloseModalButton closeModal={closeModal} />
      <div>Send the game ID to a friend for them to join</div>
      <div>
          <div>{gameID}</div><button id="copy-button" onClick={() => navigator.clipboard.writeText(gameID)}>Copy</button>
      </div>
      </div>
  )
}
