const Dom = {};
export default Dom;

Dom.setupCont = function (cont) {
  cont.style.position = "relative"
  cont.style.top = "60px"
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
  svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","g")).setAttribute("class", "streamlets_g");
  svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","g")).setAttribute("class", "legend_g");

  svg.style.position = "absolute"
  svg.style.top = "0"
  svg.style.left = "0"
  svg.style.width = dim.width + "px"
  svg.style.height = dim.height + "px"
  return svg
}

Dom.calculateLinksLengthAndSetupLinksInteraction = function (svg, links, projection, mouseOverLinkF) {
  const geoPath = d3.geoPath().projection(projection),
    start = new Date().getTime(),
    g = svg.querySelector(".streamlets_g")
  g.innerHTML = ""
  for (let i = 0; i < links.length; i++) {
    const d = links[i];
    const pathD = geoPath({type: "LineString", coordinates: [d.source.coor, d.target.coor] })
    const path = g.appendChild(document.createElementNS("http://www.w3.org/2000/svg","path"))
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

Dom.setupLegend = function (data, year, svg, dim, colors, mouseOverLinkF) {
  const trans = {afr_to_eu: "Africa to Europe", afr_to_afr: "Within Africa", other_to_eu: "Other Geographic regions to Europe"},
    data_arr = Object.keys(data).map(cat => ({cat, label:trans[cat], value: data[cat][year]})),
    width = dim.width * .06,
    x = width,
    y = dim.height-50,
    g = svg.querySelector(".legend_g"),
    scale = d3.scaleLinear()
      .range([0, width])
      .domain([0, d3.max(data_arr, d => d.value)])

  data_arr.sort((a,b) => b.value - a.value)
  g.innerHTML = "";
  //circle lengend
  /*data_arr.forEach(d => {
    const r = scale(d.value)
    const circle = g.appendChild(document.createElementNS("http://www.w3.org/2000/svg","circle"))
    circle.setAttribute("cx", x)
    circle.setAttribute("cy", y-r)
    circle.setAttribute("r", r)
    circle.setAttribute("fill", colors[d.cat])

    circle.addEventListener("mouseover", function () {mouseOverLinkF(d.cat);})
    circle.addEventListener("mouseout", function () {mouseOverLinkF(null);})


    const line = g.appendChild(document.createElementNS("http://www.w3.org/2000/svg","line"))
    line.setAttribute("x1", x-2)
    line.setAttribute("x2", x+width)
    line.setAttribute("y1", y-r*2)
    line.setAttribute("y2", y-r*2)
    line.setAttribute("stroke", "black")
    line.setAttribute("stroke-width", "1")

    const text = g.appendChild(document.createElementNS("http://www.w3.org/2000/svg","text"))
    text.setAttribute("x", x+width+7)
    text.setAttribute("y", y-r*2)
    text.setAttribute("fill", "black")
    text.setAttribute("font-size", "9")
    text.innerHTML = d.value.toLocaleString()
  })*/

  data_arr.forEach((d, i) => {
    const y = dim.height - 12 - 12*i,
      x = 10,
      w = 25,
      h = 9
    const rect = g.appendChild(document.createElementNS("http://www.w3.org/2000/svg","rect"))
    rect.setAttribute("x", x)
    rect.setAttribute("y", y-2)
    rect.setAttribute("width", w)
    rect.setAttribute("height", h)
    rect.setAttribute("fill", colors[d.cat])
    rect.setAttribute("opacity", 0.8)

    rect.addEventListener("mouseover", function () {mouseOverLinkF(d.cat);})
    rect.addEventListener("mouseout", function () {mouseOverLinkF(null);})

    const text = g.appendChild(document.createElementNS("http://www.w3.org/2000/svg","text"))
    text.setAttribute("x", x+w+9)
    text.setAttribute("y", y-2+h)
    text.setAttribute("fill", "#676161")
    text.setAttribute("font-size", h)
    text.setAttribute("font-family", "Open Sans")
    text.innerHTML = d.label
  })

}
