import React, { useState } from "react"

export default function GameOptionsBar({takeback}){

  const [ themesMenu, setThemesMenu ] = useState("closed")

  const toggleThemeMenu = () => {
    if (themesMenu === "closed"){      
      setThemesMenu("open")
      }
    if (themesMenu === "open"){
      setThemesMenu("closed")
      }
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
      <button onClick={() => {takeback()}}>Takeback</button>
    </div>
  )
}