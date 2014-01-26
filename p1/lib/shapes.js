var shapes = {
  simple : [
    ["X", "X"]
  ],
  vBar : [
    ["X"],
    ["X"],
    ["X"]
  ],
  hBar : [
    ["X","X","X"]
  ],
  square : [
    ["X","X"],
    ["X","X"]
  ],
  v : [
    ["X","0","X"],
    ["0","X","0"]
  ],
  x : [
    ["X","0","X"],
    ["0","X","0"],
    ["X","0","X"]
  ]
}

function getPlayerShape(playerCount) {
  return Object.keys(shapes)[0];
}

module.exports = {
  shapes: shapes,
  getPlayerShape: getPlayerShape
};
