import React from 'react'

export default function ClosePopUpButton({ closePopUp }) {

  return (
    <button className="close-modal-button" onClick={closePopUp}>X</button>
  )
}
