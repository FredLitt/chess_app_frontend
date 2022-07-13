import React from 'react'

export default function ConfirmResignationPopUp({ resign, closePopup }) {
  return (
    <div className="popup">
        <div>Are you sure you would like to resign?</div>
        <button className="close-popup-button" onClick={closePopup}>X</button>
        <button onClick={resign}>Confirm</button>
        </div>
  )
}
