import React, { useState } from "react"

export default function GameOptionsBar({toggleCreateGame, toggleJoinGame, takeback}){

  const [ showColorThemes, setShowColorThemes ] = useState(false)

  const changeTheme = (lightSquareChoice, darkSquareChoice, highlightChoice) => {
    document.documentElement.style.setProperty("--light-square", lightSquareChoice)
    document.documentElement.style.setProperty("--dark-square", darkSquareChoice)
    document.documentElement.style.setProperty("--highlight", highlightChoice)
  }

  const colorSchemes = [
    { light: "beige", dark: "tan", highlight: "peru" },
    { light: "lightgrey", dark: "slategrey", highlight: "darkslategrey" },
    { light: "skyblue", dark: "steelblue", highlight: "darkblue" },
    { light: "darkseagreen", dark: "green", highlight: "forestgreen" },
    { light: "palevioletred", dark: "darkmagenta", highlight: "lightblue" }
  ]

  return (
    <div id="game-options-bar">
      <button onClick={toggleCreateGame}>Create Game</button>
      <button onClick={toggleJoinGame}>Join Game</button>
      {/* <button onClick={takeback}>Takeback</button> */}

      <button onClick={() => {setShowColorThemes(!showColorThemes)}}>Board Theme</button>
      {showColorThemes && 
        <div id="theme-options">
          {colorSchemes.map((scheme, index) =>
            <div 
              className="color-choice" 
              key={index}
              onClick={() => {
                changeTheme(scheme.light, scheme.dark, scheme.highlight)
                setShowColorThemes(false)}}>
              <div style={{backgroundColor: scheme.light}}></div>
              <div style={{backgroundColor: scheme.dark}}></div>
            </div>
          )}
        </div>}
    </div>
  )
}