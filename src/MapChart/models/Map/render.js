const Render = {};
export default Render;

Render.drawLinks = function (trans_point, links, ctx, projection, style) {
  const geoPath = d3.geoPath().projection(projection)
  geoPath.context(ctx)

  const start = new Date().getTime();
  let count = 0
  for (let i = 0; i < links.length; i++) {
    const d = links[i];
    let color = style.colors[d.cat];
    count++
    ctx.beginPath();
    ctx.lineWidth = style["stroke-width"];
    ctx.strokeStyle = color;
    ctx.setLineDash([d.total_length * trans_point, d.total_length]);
    geoPath({type: "LineString", coordinates: [d.source.coor, d.target.coor] })
    ctx.stroke();
  }
  console.log("total number of links: ", count)
  const took = new Date().getTime() - start;
  // console.log("took: " + took + " ms")
}