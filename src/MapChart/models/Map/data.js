const Data = {};
export default Data;

Data.calculateLinksLengthAndSetupLinksInteraction = function (svg, links, projection) {
  const geoPath = d3.geoPath().projection(projection),
    start = new Date().getTime();
  svg.innerHTML = ""
  for (let i = 0; i < links.length; i++) {
    const d = links[i];
    const pathD = geoPath({type: "LineString", coordinates: [d.source.coor, d.target.coor] })
    const path = svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","path"))
    path.setAttribute("d", pathD)
    path.setAttribute("stroke-width", "3")
    path.setAttribute("opacity", "0")
    path.addEventListener("mouseover", function () {
      console.log(d.target.place)
    })
    d.total_length = path.getTotalLength()
  }
  console.log("done calculation: " + (new Date().getTime() - start) + " ms")
}