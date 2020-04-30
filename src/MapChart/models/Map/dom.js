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

Dom.calculateLinksLengthAndSetupLinksInteraction = function (svg, links, projection, mouseOverLinkF) {
  const geoPath = d3.geoPath().projection(projection),
    start = new Date().getTime();

  svg.innerHTML = ""
  for (let i = 0; i < links.length; i++) {
    const d = links[i];
    const pathD = geoPath({type: "LineString", coordinates: [d.source.coor, d.target.coor] })
    const path = svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","path"))
    path.setAttribute("d", pathD)
    path.setAttribute("stroke-width", "5")
    path.setAttribute("opacity", "0")
    path.setAttribute("fill", "none")
    path.setAttribute("stroke", "black")
    path.addEventListener("mouseover", function () {mouseOverLinkF(d.cat);})
    path.addEventListener("mouseout", function () {mouseOverLinkF(null);})
    d.total_length = path.getTotalLength()
  }
  console.log("done calculation: " + (new Date().getTime() - start) + " ms")
}
