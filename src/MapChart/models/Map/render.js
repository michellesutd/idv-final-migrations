const Render = {};
export default Render;

Render.drawLinks = function (trans_point, links, ctx, projection, style) {
  const geoPath = d3.geoPath().projection(projection)
  geoPath.context(ctx)

  const start = new Date().getTime();
  for (let i = 0; i < links.length; i++) {
    const d = links[i];
    let color;
    if (d.source.geo_region === "Africa" && d.target.geo_region === "Europe") color = style.colors["afr_to_eu"]
    else if (d.target.geo_region === "Europe") color = style.colors["other_to_eu"]
    else if (d.source.geo_region === "Africa" && d.target.geo_region === "Africa") color = style.colors["afr_to_afr"]
    else continue

    ctx.beginPath();
    ctx.lineWidth = style["stroke-width"];
    ctx.strokeStyle = color;
    ctx.setLineDash([d.total_length * trans_point, d.total_length]);
    geoPath({type: "LineString", coordinates: [d.source.coor, d.target.coor] })
    ctx.stroke();
  }
  const took = new Date().getTime() - start;
  // console.log("took: " + took + " ms")
}