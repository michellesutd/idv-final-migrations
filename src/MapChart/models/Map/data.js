const Data = {};
export default Data;

Data.calculateLinksLength = function (links, projection) {
  const svg = document.createElement("svg"),
    geoPath = d3.geoPath().projection(projection),
    start = new Date().getTime();
  for (let i = 0; i < links.length; i++) {
    const d = links[i];
    const pathD = geoPath({type: "LineString", coordinates: [d.source.coor, d.target.coor] })
    const path = svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","path"))
    path.setAttribute("d", pathD)
    d.total_length = path.getTotalLength()
  }
  svg.remove()
  console.log("done calculation: " + (new Date().getTime() - start) + " ms")

}