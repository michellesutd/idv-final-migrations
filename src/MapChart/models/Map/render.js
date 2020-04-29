const Render = {};
export default Render;

Render.drawLinks = function (links_by_year, ctx, projection, style) {
  const geoPath = d3.geoPath().projection(projection);
  geoPath.context(ctx)
  const years = Object.keys(links_by_year);
  console.log(links_by_year)

  const data_year = links_by_year[years[0]];
  const start = new Date().getTime()
  for (let i = 0; i < data_year.length; i++) {
    const d = data_year[i];
    if (d.source.geo_region !== "Africa" || d.target.geo_region !== "Europe") continue

    ctx.beginPath();
    ctx.lineWidth = style["stroke-width"];
    ctx.strokeStyle = style.color;
    ctx.setLineDash([d.total_length, d.total_length]);
    geoPath({type: "LineString", coordinates: [d.source.coor, d.target.coor] })
    ctx.stroke();
  }
  console.log("done: " + (new Date().getTime() - start) + " ms")
}