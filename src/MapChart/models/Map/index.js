import MapChart from '../../index.js'
import Style from "./style.js"
import Dom from "./dom.js"
import Render from "./render.js"
import Data from "./data.js"
export default function Map(cont, store) {
  const self = this;

  self.cont = cont;
  self.store = store;
  Dom.setupCont(self.cont)
}

Map.prototype.create = function () {
  const self = this;

  self.d3_projection = MapChart.projection.setup({})
  self.d3_projection.scale(120)
  self.d3_projection.translate([ 480, 350 ])
  self.dim = Style.setupDims(self.cont.getBoundingClientRect());
  [self.canvas1, self.ctx1] = Dom.setupCanvas(self.cont, self.dim);
  [self.canvas2, self.ctx2] = Dom.setupCanvas(self.cont, self.dim);
  self.world_map_geojson = self.store.world_map_geojson;
}

Map.prototype.update = function() {
  const self = this;
  self.drawBg();
  self.drawLinks();
}

Map.prototype.updateSelectedYear = function() {
  const self = this;
  self.drawLinks();
}

Map.prototype.drawBg = function () {
  const self = this;
  const ctx = self.ctx1,
    dim = self.dim,
    projection = self.d3_projection

  ctx.clearRect(0,0,dim.width, dim.height)
  MapChart.polygons.drawMultiple(self.world_map_geojson.features, d => d, ctx, projection, Style.world_map_bg)
}

Map.prototype.drawLinks = function () {
  const self = this;
  const ctx = self.ctx2,
    dim = self.dim,
    projection = self.d3_projection,
    links_by_year = self.store.links_by_year,
    links = links_by_year[self.store.selected_year],
    style = Style.links

  Data.calculateLinksLength(links, projection)

  if (self.timer) self.timer.stop()
  self.timer = d3.timer(tick)
  let offset, trans_point = 0
  function tick(t) {
    if (trans_point > 1) self.timer.stop()
    if (!offset) offset = t;
    t = t - offset
    trans_point = t/2000
    ctx.clearRect(0,0,dim.width, dim.height);
    Render.drawLinks(trans_point, links, ctx, projection, style);
  }
}
