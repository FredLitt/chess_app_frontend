import React, { useState } from "react"

export default function GameOptionsBar({startNewGame, takeback}){

  const [ showColorThemes, setShowColorThemes ] = useState(false)

  // Menu should close when clicking outside
  const toggleThemeMenu = () => {
    setShowColorThemes(!showColorThemes)
    // if (setShowColorThemes){
    //   console.log("themes open")
    //   const app = document.querySelector("#game-options-bar > button")
    //   app.addEventListener("click", () => setShowColorThemes(false))
    // }
  } 

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
      <button onClick={() => {startNewGame()}}>Start New Game</button>
      <button onClick={() => {takeback()}}>Takeback</button>
      <button onClick={() => {toggleThemeMenu()}}>Board Theme</button>
      {showColorThemes && 
        <div id="theme-options">
          {colorSchemes.map((scheme, index) =>
            <div 
              className="color-choice" 
              key={index}
              onClick={() => {
                changeTheme(scheme.light, scheme.dark, scheme.highlight)
                toggleThemeMenu()}}>
              <div style={{backgroundColor: scheme.light}}></div>
              <div style={{backgroundColor: scheme.dark}}></div>
            </div>
          )}
        </div>}
    </div>
  )
}