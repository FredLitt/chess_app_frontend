import React, { useState } from "react"

export default function GameOptionsBar({toggleCreateGame, toggleJoinGame, takeback}){

  const [ showThemes, setshowThemes ] = useState(false)

  const themes = {
    "desert": { light: "beige", dark: "tan", highlight: "peru" },
    "grey": { light: "lightgrey", dark: "slategrey", highlight: "darkslategrey" },
    "blue": { light: "skyblue", dark: "steelblue", highlight: "darkblue" },
    "green": { light: "darkseagreen", dark: "green", highlight: "lightgreen" },
    "cheshire": { light: "palevioletred", dark: "darkmagenta", highlight: "lightblue" }
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