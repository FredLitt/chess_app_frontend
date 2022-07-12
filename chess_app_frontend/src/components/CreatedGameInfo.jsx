import React from 'react'

export default function CreatedGameInfo({gameData, closePopUp}) {

  return (
    <div id="created-game-info" unselectable='on'>
        <button className="close-popup-button" onClick={closePopUp}>X</button>
        <div>Send the game ID to a friend for them to join: </div>
        <div>
            <div>{gameData.id} </div><button>Copy</button>
        </div>
        </div>
  )
}
