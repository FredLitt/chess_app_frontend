import React from 'react'
import ClosePopUpButton from './ClosePopUpButton'

export default function ConfirmResignationPopUp({ resign, closePopUp }) {
  return (
    <div className="popup">
      <div>Are you sure you would like to resign?</div>
      <ClosePopUpButton closePopUp={closePopUp} />
      <button onClick={resign}>Confirm</button>
      </div>
  )
}
