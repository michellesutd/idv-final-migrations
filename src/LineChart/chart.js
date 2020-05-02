function create(cont){
  cont = d3.select(cont)
  const svg = cont.append("svg").attr("class", "chart");
  svg.append("defs").html(`
<mask class="histogram_mask" id="histogram_mask">
  <rect stroke="#fff" fill="#fff" />
</defs> 
  `)

  svg.append("g").attr("class", "axis_g")
  svg.append("g").attr("class", "main_g");

}

function updateElements(cont, dim) {
  cont = d3.select(cont)
  const svg = cont.select("svg.chart"),
    main_g = svg.select("g.main_g"),
    mask_rect = svg.select("mask rect")

  svg.attr("width", dim.outer_width).attr("height", dim.outer_height);
  main_g.attr("transform", "translate(" + dim.ml + "," + dim.mt + ")").attr("mask", "url(#histogram_mask)")
  mask_rect
    .attr("x", -dim.width).attr("y", 0).attr("width", dim.width).attr("height", dim.height+dim.mt+dim.mb)
}

function draw(data, cont, dim, [d3x, d3y], [xValue, yValue], style, mouseOverLinkF) {
  cont = d3.select(cont)
  const svg = cont.select("svg.chart"),
    main_g = svg.select("g.main_g");

  main_g.html("")
  drawAxis()

  for (let cat in data) {
    if (!data.hasOwnProperty(cat)) continue
    drawLine(data[cat], style[cat], cat)
  }

  function drawLine(data, style, cat) {
    const line = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => d3x(xValue(d)))
      .y(d => d3y(yValue(d)));

    main_g.append("path")
      .attr("class", "line")
      .style("fill", "none")
      .style("stroke-width", 2)
      .style("stroke", style.color)
      .attr("d", line(data));

    const area = d3.area()
      .curve(d3.curveMonotoneX)
      .x(d => d3x(xValue(d)))
      .y0(d => d3y.range()[0])
      .y1(d => d3y(yValue(d)));

    main_g.append("path")
      .attr("class", "area")
      .style("fill", "#fff")
      .style("stroke-width", 0)
      .attr("d", area(data))

    const path_area = main_g.append("path")
      .attr("class", "area")
      .style("fill", style.color)
      .style("fill-opacity", .2)
      .style("stroke-width", 0)
      .attr("d", area(data));

    // path_area.node().addEventListener("mouseover", function () {mouseOverLinkF(cat);})
    // path_area.node().addEventListener("mouseout", function () {mouseOverLinkF(null);})

    data.forEach(d => {
      main_g.append("line")
        .attr("x1", d3x(xValue(d)))
        .attr("x2", d3x(xValue(d)))
        .attr("y1", d3y.range()[0])
        .attr("y2", d3y(yValue(d)))
        .attr("stroke-width", 2)
        .style("stroke", style.color)

    })

  }

  function drawAxis() {
    const axis_g = svg.select("g.axis_g")
    axis_g.html("")
    axis_g.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(" + (dim.ml + dim.width) + "," + dim.mt + ")")
      .call(d3.axisRight(d3y).tickFormat(n => numberFormat(n, 2)).ticks(4));
    axis_g.select(".axis--y .domain").style("opacity", 0)

    function numberFormat(n,d){let x=(''+n).length,p=Math.pow;d=p(10,d);x-=x%3;return Math.round(n*d/p(10,x))/d+" kMBTPE"[x/3]}

  }
}


export default {
  create,
  updateElements,
  draw,
}




