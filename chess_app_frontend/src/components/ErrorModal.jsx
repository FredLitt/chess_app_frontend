import React from 'react'
import ClosePopUpButton from './ClosePopUpButton'

export default function ErrorModal() {
  return (
    <>
    <ClosePopUpButton />
    <div className="popup">A server error has occured. Please try refreshing the page.</div>
    </>
    
  )
}
