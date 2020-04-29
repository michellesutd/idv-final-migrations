const Render = {};
export default Render;

Render.drawLinks = function (links_by_year, ctx, d3_projection, style) {
    const years = Object.keys(links_by_year);
    console.log(links_by_year)
  
    const data_year = links_by_year[years[0]],
      d3_path = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => d[0]).y(d => d[1])
    for (let i = 0; i < data_year.length; i++) {
      const d = data_year[i];
      if (d.source.geo_region !== "Africa" || d.target.geo_region !== "Europe") continue
      const path_d = d3_path([d3_projection(d.source.coor), d3_projection(d.target.coor)]),
        path2D = new Path2D(path_d);
  
      ctx.beginPath();
      ctx.lineWidth = style["stroke-width"];
      ctx.strokeStyle = style.color;
      ctx.stroke(path2D);
    }
    console.log("done")
  }