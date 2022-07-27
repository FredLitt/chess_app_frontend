import React from 'react'
import CloseModalButton from './CloseModalButton'

export default function ErrorModal({ closeModal }) {
  return (
    <>
      <CloseModalButton closeModal={closeModal} />
      <div className="modal">A server error has occured. Please try refreshing the page.</div>
    </>
  )
}
