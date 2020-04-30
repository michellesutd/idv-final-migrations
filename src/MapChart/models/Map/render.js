const Render = {};
export default Render;

Render.drawLinks = function (links, ctx, projection, style) {
  const geoPath = d3.geoPath().projection(projection),
    drawn_places = []
  geoPath.context(ctx)

  const start = new Date().getTime();
  for (let i = 0; i < links.length; i++) {
    const d = links[i];
    if (d.t === 0 || d.alpha === 0) continue
    let color = style.colors[d.cat];
    ctx.globalAlpha = d.alpha;
    ctx.beginPath();
    ctx.lineWidth = style["stroke-width"];
    ctx.strokeStyle = color;
    ctx.setLineDash([d.total_length * d.t, d.total_length]);
    geoPath({type: "LineString", coordinates: [d.source.coor, d.target.coor] })
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  const took = new Date().getTime() - start;
  // console.log("took: " + took + " ms")

  for (let i = 0; i < links.length; i++) {
    const d = links[i];
    drawText(d.source)
    drawText(d.target)
  }

  function drawText(d) {
    if (drawn_places.indexOf(d.place) !== -1) return
    drawn_places.push(d.place)
    ctx.textAlign = d.coor[0] > 0 ? "start" : "end";
    ctx.font = 10+'px sans-serif';

    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.strokeStyle = "white";
    ctx.strokeText(d.place, ...projection(d.coor));

    ctx.fillStyle = "black";
    ctx.fillText(d.place, ...projection(d.coor));
  }
}


