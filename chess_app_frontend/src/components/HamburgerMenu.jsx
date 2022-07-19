import React, { useState } from 'react'

export default function HamburgerMenu() {

    const [ isOpen, setIsOpen ] = useState(false)

  return (
    <button id="hamburger-menu" onClick={() => setIsOpen(!isOpen)}>HamburgerMenu</button>
  )
}
