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
  "stroke-width": 0.2,
  fill: "grey",
  color: "rgba(255, 255, 255, 0)"
}

Style.points = {
  fill: "red",
  r: 4
}

Style.links = {
  "stroke-width": 0.9,
  colors: {
    afr_to_eu: "#CE2150",
    other_to_eu: "#2E78BA",
    afr_to_afr: "#EE8E13"
  }
}

