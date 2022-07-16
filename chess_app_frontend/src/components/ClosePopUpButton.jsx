import React from 'react'

export default function ClosePopUpButton({ closePopUp }) {

  return (
    <button className="close-popup-button" onClick={closePopUp}>X</button>
  )
}
