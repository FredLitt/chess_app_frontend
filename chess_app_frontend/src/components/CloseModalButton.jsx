import React from 'react'

export default function CloseModalButton({ closeModal }) {
  
  return (
    <button className="close-modal-button" onClick={closeModal}>X</button>
  )
}
