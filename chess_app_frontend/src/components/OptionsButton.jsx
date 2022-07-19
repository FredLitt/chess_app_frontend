import React from 'react'

export default function OptionsButton({ name, text, toggleOption }) {

  return (
    <button className="options-button" type="button" name={name} onClick={(e) => toggleOption(e.target.name)}>{text}</button>
  )
}
