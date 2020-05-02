const Style = {};
export default Style;

Style.setupDims = function ({width, height}) {
  const dim = {
    width,
    height
  }
  return dim
}

Style.world_map_bg = {
  "stroke-width": 0.1,
  fill: "grey",
  color: "rgba(255,255,255,0)"
}

Style.points = {
  fill: "red",
  r: 4
}

Style.links = {
  "stroke-width": .8,
  colors: {
    afr_to_eu: "red",
    other_to_eu: "blue",
    afr_to_afr: "darkgreen"
  }
}

