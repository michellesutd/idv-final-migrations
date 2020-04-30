import Chart from "./chart.js"
import Data from "./data.js"
import Style from "./style.js"

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

  self.line_data = Data.prepareData(self.store.data_by_cat_years)
  console.log(self.line_data);
  [self.d3x, self.d3y] = self.setupAxis();
  const [xValue, yValue] = [d => d.date, d => d.value]
  Chart.draw(self.line_data, self.cont, self.dim, [self.d3x, self.d3y], [xValue, yValue], Style.style)
}

LineChart.prototype.setupAxis = function() {
  const self = this;
  let data = self.line_data;
  if (!Array.isArray(data)) data = d3.merge(Object.values(data))
  return [setupXScale(), setupYScale()]

  function setupXScale() {
    return d3.scaleLinear()
      .domain(d3.extent(data, d => d.date))
      .range([0, self.dim.width])
  }

  function setupYScale() {
    return d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([self.dim.height, 0])
  }
}
