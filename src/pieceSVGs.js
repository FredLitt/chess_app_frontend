const getSVG = (code) => {
    if (!code){ return ""}
    return `https://upload.wikimedia.org/wikipedia/commons/${code}45.svg`
}

const pieceSVGs = {
    "pawn": {
        "white": getSVG("4/45/Chess_plt"),
        "black":  getSVG("c/c7/Chess_pdt")
      },
      "knight": {
        "white": getSVG("7/70/Chess_nlt"),
        "black": getSVG("e/ef/Chess_ndt"),
      },
      "bishop": {
        "white": getSVG("b/b1/Chess_blt"),
        "black": getSVG("9/98/Chess_bdt"),
      },
      "rook": {
        "white": getSVG("7/72/Chess_rlt"),
        "black": getSVG("f/ff/Chess_rdt"),
      },
      "queen": {
        "white": getSVG("1/15/Chess_qlt"),
        "black": getSVG("4/47/Chess_qdt"),
      },
      "king": {
        "white": getSVG("4/42/Chess_klt"),
        "black": getSVG("f/f0/Chess_kdt")
      }
}

export default pieceSVGs