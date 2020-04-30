import Chart from "./chart.js"
import Data from "./data.js"


export default function LineChart(cont, store) {
  const self = this;

  self.cont = cont;
  self.store = store;
}

LineChart.prototype.create = function () {
  const self = this;
  self.dim = Chart.setupDims(self.cont.getBoundingClientRect())
  Chart.create(self.cont);
  Chart.updateElements(self.cont, self.dim)
}

LineChart.prototype.draw = function() {
  const self = this;
  self.line_data = Data.setupTotalByYears(self.store.data);
  [self.d3x, self.d3y] = self.setupAxis();
  const [xValue, yValue] = [d => d.date, d => d.value]
  Chart.draw(self.line_data, self.cont, self.dim, [self.d3x, self.d3y], [xValue, yValue])
}

LineChart.prototype.setupAxis = function() {
  const self = this;
  let data = self.line_data;
  if (!Array.isArray(data)) data = d3.merge(Object.values(data))
  return [setupXScale(), setupYScale()]

  function setupXScale() {
    return d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, self.dim.width])
  }

  function setupYScale() {
    return d3.scaleLinear()
      .domain(d3.extent(data, d => d.value))
      .range([self.dim.height, 0])
  }
}