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
  self.d3_projection.scale(170)
  self.d3_projection.translate([ 550, 350 ])
  self.dim = Style.setupDims(self.cont.getBoundingClientRect());
  [self.canvas1, self.ctx1] = Dom.setupCanvas(self.cont, self.dim);
  [self.canvas2, self.ctx2] = Dom.setupCanvas(self.cont, self.dim);
  self.svg = Dom.setupOverlaySvg(self.cont, self.dim);
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
