import React from 'react'

export default function CreateGameModal({selectColor, createGame}) {
  return (
    <div className="modal">
      <div id="create-game-modal-content">
        <div>New game</div>
        <div>Select color</div>
        <button onClick={(e) => selectColor(e.target.value)} value="white">White</button>
        <button onClick={(e) => selectColor(e.target.value)} value="black">Black</button>
        <button onClick={createGame}>Create Game!</button>
      </div>
    </div>
  )
}
