const Dom = {};
export default Dom;

Dom.setupCont = function (cont) {
  cont.style.position = "relative"
}

Dom.setupCanvas = function (cont, dim) {
  const canvas = cont.appendChild(document.createElement("canvas")),
    ctx = canvas.getContext("2d")
  canvas.style.position = "absolute"
  canvas.style.top = "0"
  canvas.style.left = "0"
  canvas.setAttribute("width", dim.width)
  canvas.setAttribute("height", dim.height)
  return [canvas, ctx]
}

Dom.setupOverlaySvg = function (cont, dim) {
  const svg = cont.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "svg"));

  svg.style.position = "absolute"
  svg.style.top = "0"
  svg.style.left = "0"
  svg.style.width = dim.width + "px"
  svg.style.height = dim.height + "px"
  return svg
}