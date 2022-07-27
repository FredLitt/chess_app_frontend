import React from 'react'
import CloseModalButton from './CloseModalButton'

export default function ErrorModal({ closeModal }) {
  return (
    <div className="modal">
      <CloseModalButton closeModal={closeModal} />
      <div>A server error has occured. Please try refreshing the page.</div>
    </div>
  )
}
