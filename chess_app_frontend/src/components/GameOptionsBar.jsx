import React, { useState } from "react"
import { themes } from "./themes"

export default function GameOptionsBar({toggleCreateGame, toggleJoinGame, resign, takeback}){

  const [ showThemes, setshowThemes ] = useState(false)
  const [ offerToResign, setOfferToResign ] = useState(false)

  const handleResignationClick = () => {
    if (!offerToResign){
      setOfferToResign(true)
      return setTimeout(() => setOfferToResign(false), 3000)
    } 
    resign()
  }

  const setTheme = (selectedScheme) => {
    const selectedColors = Object.values(selectedScheme)
    let themeSetting
    for (const theme in themes){
      const themeColors = Object.values(themes[theme])
      if (themeColors[0] === selectedColors[0]){
        themeSetting = theme
      }
    }
    localStorage.setItem("CHESS_BOARD_THEME", JSON.stringify(themeSetting))
  }

  const setColor = () => {
    let storedTheme = JSON.parse(localStorage.getItem("CHESS_BOARD_THEME"))
    if (!storedTheme) storedTheme = "desert"
    const colorScheme = themes[storedTheme]
    const {light, dark, highlight} = colorScheme
    document.documentElement.style.setProperty("--light-square", light)
    document.documentElement.style.setProperty("--dark-square", dark)
    document.documentElement.style.setProperty("--highlight", highlight)
  }

  setColor()

  return (
    <div id="game-options-bar">
      <button onClick={toggleCreateGame}>Create Game</button>
      <button onClick={toggleJoinGame}>Join Game</button>
      <button onClick={handleResignationClick} style={{backgroundColor: offerToResign ? "red" : "var(--main-bg-color)" }}>Resign</button>
      {/* <button onClick={takeback}>Takeback</button> */}

      <button onClick={() => {setshowThemes(!showThemes)}}>Board Theme</button>
      {showThemes && 
        <div id="theme-options">
          {Object.values(themes).map((scheme, index) =>
            <div 
              className="color-choice" 
              key={index}
              onClick={() => {
                setTheme(scheme)
                setshowThemes(false)}}>
              <div style={{backgroundColor: scheme.light}}></div>
              <div style={{backgroundColor: scheme.dark}}></div>
            </div>
          )}
        </div>}
    </div>
  )
}