import React from 'react'
import CloseModalButton from './CloseModalButton'

export default function ConfirmResignationModal({ resign, closeModal }) {
  return (
    <div className="modal">
      <div>Are you sure you would like to resign?</div>
      <CloseModalButton closeModal={closeModal} />
      <button onClick={resign}>Confirm</button>
      </div>
  )
}
