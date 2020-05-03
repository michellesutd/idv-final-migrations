export default function Slider(cont, store) {
    const self = this;
  
    self.cont = d3.select(cont);
    self.store = store;
  
    self.create()
    self.setupDims();
    self.updateElements();
  }
  
  Slider.prototype.create = function (){
    const self = this;
    const svg = self.cont.append("svg").attr("class", "chart"),
      main_g = svg.append("g").attr("class", "main_g");
  }
  
  Slider.prototype.setupDims = function () {
    const self = this
    const rect = self.cont.node().getBoundingClientRect();
    const dim = {
      outer_width: rect.width,
      outer_height: rect.height,
      mt: 0,
      mr: 40,
      mb: 0,
      ml: 40
    };
    dim.width = dim.outer_width - dim.ml - dim.mr;
    dim.height = dim.outer_height - dim.mt - dim.mb;
  
    self.dim = dim
  }
  
  Slider.prototype.updateElements = function () {
    const self = this;
  
    const dim = self.dim,
      svg = self.cont.select("svg.chart"),
      main_g = svg.select("g.main_g");
  
    svg.attr("width", dim.outer_width).attr("height", dim.outer_height);
    main_g.attr("transform", "translate(" + dim.ml + "," + dim.mt + ")");
  }
  
  Slider.prototype.update = function () {
    const self = this;
  
    const years = Object.keys(self.store.links_by_year),
      dim = self.dim,
      d3x = self.d3x = setupAxis(),
      cont = self.cont,
      svg = cont.select("svg.chart"),
      main_g = svg.select("g.main_g")
  
    main_g.html("")
    drawSlider(years)
  
    function setupAxis() {
  
      const d3x = d3.scaleLinear()
        .domain(d3.extent(years, d => +d))
        .range([0, dim.width])
        .clamp(true);
  
  
      return d3x
    }
  
    function drawSlider() {
      const slider = main_g.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + 0 + "," + dim.height / 2 + ")");
  
      slider.append("line")
        .attr("class", "track")
        .attr("x1", d3x.range()[0]-35)
        .attr("x2", d3x.range()[1]+35)
        .select(function () {
          return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-inset")
        .select(function () {
          return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-overlay")
        .style("pointer-events", "stroke")
        .style("stroke-width", "10px")
        .style("stroke", "transparent")
        .style("cursor", "crosshair")
        .call(d3.drag()
          .on("start.interrupt", function () {
            slider.interrupt();
          })
          .on("start drag", function () {
            const x = d3x.invert(d3.event.x);
            const year = findClosest(years, x)
            self.store.event.trigger("updateSelectedYear", {year, silent: false, self_trigger: true})
            self.move(year);
          })
        );
  
      slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 8 + ")")
        .selectAll("text")
        .data(years)
        .enter().append("text")
        .attr("x", d3x)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("font-family", "Open Sans")
        .attr("color", "#676161")
        .attr("opacity", "0.5")
        .text(function (d) {
          return d
        });
  
        var handle = slider.insert("line", ".track-overlay")
        .attr("class", "handle")
        .attr("y1", -dim.height / 5)
        .attr("y2", dim.height / 2)
        .attr("stroke-width", 35)
        .attr("stroke", "rgba(25,112,132,.2)")
        .style("opacity", 0)
    }
    
    function findClosest(arr, n) {
      return arr.reduce(function(prev, curr) {
        return (Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev);
      });
    }
  }
  
  Slider.prototype.move = function (x) {
      const self = this;
      const handle = self.cont.select(".handle")
      handle.attr("x1", self.d3x(x));
      handle.attr("x2", self.d3x(x));
  }
  
  Slider.prototype.updateValue = function() {
    const self = this;
  
  }
  
  Slider.prototype.updateSelectedYear = function ({year, silent, self_trigger}) {
    const self = this;
    if (!self_trigger) self.move(self.store.selected_year)
  }
  