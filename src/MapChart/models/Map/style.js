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
  
  fill: "grey",
  color: "black"
  color: "rgba(255,255,255,0)"
}

Style.points = {
  fill: "red",
  r: 4
}

Style.links = {
    "stroke-width": .3,
    color: "red"
  }