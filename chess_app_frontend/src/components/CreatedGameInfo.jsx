import React from 'react'

export default function CreatedGameInfo({gameData}) {

  return (
    <div id="created-game-info" unselectable='on'>
        <div>Send the game ID to a friend for them to join: </div>
        <div>
            <div>{gameData.id} </div><button>Copy</button>
        </div>
        </div>
  )
}
