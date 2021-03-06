import Chart from "./chart.js"
import Data from "./data.js"
import Style from "./style.js"

export default function LineChart(cont, store, config) {
  const self = this;

  self.cont = cont;
  self.store = store;
  self.config = config;
}

LineChart.prototype.create = function () {
  const self = this;
  self.dim = Style.setupDims(self.cont.getBoundingClientRect())
  Chart.create(self.cont);
  Chart.updateElements(self.cont, self.dim)
}

LineChart.prototype.draw = function() {
  const self = this;

  const focused_category = self.store.focused_migration_category,
    [xValue, yValue] = [d => d.date, d => d.value],
    style = {
      afr_to_eu: {color: "#CE2150"},
      afr_to_afr: {color: focused_category === "other_to_eu" ? "none" : "#EE8E13"},
      other_to_eu: {color: focused_category === "afr_to_afr" ? "none" :"#2E78BA"}
    },
    orientation = self.config.orientation,
    mouseOverLinkF = cat => self.store.event.trigger("updateFocusedMigrationCategory", cat)


  self.line_data = Data.prepareData(self.store.data_by_cat_years, self.config.categories)
  ;[self.d3x, self.d3y] = self.setupAxis(orientation);
  Chart.draw(self.line_data, self.cont, self.dim, [self.d3x, self.d3y], [xValue, yValue], style, mouseOverLinkF)
}

LineChart.prototype.setupAxis = function(orientation) {
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
      .domain(d3.extent(data, d => d.value))
      .range(orientation === "up" ? [self.dim.height, 0] : [0, self.dim.height])
  }
}
