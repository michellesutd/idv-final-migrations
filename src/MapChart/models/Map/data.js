const Data = {};
export default Data;

Data.calculateLinksLength = function (links_by_year, projection) {
  const svg = document.createElement("svg"),
    geoPath = d3.geoPath().projection(projection),
    years = Object.keys(links_by_year),
    data_year = links_by_year[years[0]],
    start = new Date().getTime();
  for (let i = 0; i < data_year.length; i++) {
    const d = data_year[i];
    if (d.source.geo_region !== "Africa" || d.target.geo_region !== "Europe") continue
    const pathD = geoPath({type: "LineString", coordinates: [d.source.coor, d.target.coor] })
    const path = svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","path"))
    path.setAttribute("d", pathD)
    d.total_length = path.getTotalLength()
  }
  svg.remove()
  console.log("done calculation: " + (new Date().getTime() - start) + " ms")

}