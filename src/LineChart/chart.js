function create(cont){
  cont = d3.select(cont)
  const svg = cont.append("svg").attr("class", "chart"),
    main_g = svg.append("g").attr("class", "main_g");
}

function setupDims({width, height}) {
  const dim = {
    outer_width: width,
    outer_height: height,
    mt: 60,
    mr: 20,
    mb: 30,
    ml: 40
  };
  dim.width = dim.outer_width - dim.ml - dim.mr;
  dim.height = dim.outer_height - dim.mt - dim.mb;

  return dim
}

function updateElements(cont, dim) {
  cont = d3.select(cont)
  const svg = cont.select("svg.chart"),
    main_g = svg.select("g.main_g");

  svg.attr("width", dim.outer_width).attr("height", dim.outer_height);
  main_g.attr("transform", "translate(" + dim.ml + "," + dim.mt + ")");
}

function draw(data, cont, dim, [d3x, d3y], [xValue, yValue], style) {
  cont = d3.select(cont)
  const svg = cont.select("svg.chart"),
    main_g = svg.select("g.main_g")
  main_g.html("")
  drawAxis()

  for (let k in data) {
    if (!data.hasOwnProperty(k)) continue
    drawLine(data[k], style[k])
  }

  function drawLine(data, style) {
    const line = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => d3x(xValue(d)))
      .y(d => d3y(yValue(d)));

    main_g.append("path")
      .attr("class", "line")
      .style("fill", "none")
      .style("stroke-width", 3)
      .style("stroke", style.color)
      .attr("d", line(data));

    const area = d3.area()
      .curve(d3.curveMonotoneX)
      .x(d => d3x(xValue(d)))
      .y0(d => d3y(0))
      .y1(d => d3y(yValue(d)));

    main_g.append("path")
      .attr("class", "area")
      .style("fill", style.color)
      .style("fill-opacity", .2)
      .style("stroke-width", 0)
      .attr("d", area(data));

  }

  function drawAxis() {
    main_g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + dim.height + ")")
      .call(d3.axisBottom(d3x).ticks(0));

    main_g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(d3y).tickFormat(n => numberFormat(n, 2)));

    function numberFormat(n,d){let x=(''+n).length,p=Math.pow;d=p(10,d);x-=x%3;return Math.round(n*d/p(10,x))/d+" kMBTPE"[x/3]}

  }
}


export default {
  create,
  setupDims,
  updateElements,
  draw,
}

