import React from 'react'

export default function CreatedGameInfo({gameData, closePopUp}) {

    const gameID = `${gameData.id}${gameData.color[0]}`

  return (
    <div id="created-game-info" unselectable='on'>
        <button className="close-popup-button" onClick={closePopUp}>X</button>
        <div>Send the game ID to a friend for them to join</div>
        <div>
            <div>{gameData.id} </div><button onClick={() =>  navigator.clipboard.writeText(gameID)}>Copy</button>
        </div>
        </div>
  )
}
