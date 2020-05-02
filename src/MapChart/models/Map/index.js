import MapChart from '../../index.js'
import Style from "./style.js"
import Dom from "./dom.js"
import Render from "./render.js"
import Data from "./data.js"
import Animate from "./animate.js";

export default function Map(cont, store) {
  const self = this;

  self.cont = cont;
  self.store = store;
  Dom.setupCont(self.cont)
  self.animation = new Animate()
}

Map.prototype.create = function () {
  const self = this;

  self.dim = Style.setupDims(self.cont.getBoundingClientRect());
  self.d3_projection = MapChart.projection.setup({})
  const t = MapChart.projection.geojsonCenter(self.d3_projection, self.store.world_map_geojson, self.dim);
  MapChart.projection.updateProjection(self.d3_projection, t)
  ;[self.canvas1, self.ctx1] = Dom.setupCanvas(self.cont, self.dim);
  ;[self.canvas2, self.ctx2] = Dom.setupCanvas(self.cont, self.dim);
  self.svg = Dom.setupOverlaySvg(self.cont, self.dim);
  self.world_map_geojson = self.store.world_map_geojson;
  self.drawBg();
}

Map.prototype.update = function() {
  const self = this;
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
  Render.drawDottedMapBg(self.world_map_geojson, ctx, projection, dim)
  Render.drawSideLowerText(ctx, dim)
}

Map.prototype.drawLinks = function () {
  const self = this;
  if (self.animating) return
  let ctx = self.ctx2,
    dim = self.dim,
    projection = self.d3_projection,
    links_by_year = self.store.links_by_year,
    selected_year = self.store.selected_year,
    links = links_by_year[selected_year],
    focused_migration_category = self.store.focused_migration_category,
    style = Style.links;

  self.calculateLinksLengthAndSetupLinksInteraction(selected_year)
  if (focused_migration_category) links = links.filter(d => d.cat === focused_migration_category)

  links.forEach(d => {d.t = 1; d.alpha = 1})
  ctx.clearRect(0,0,dim.width, dim.height);
  Render.drawLinks(links, ctx, projection, style);
}

Map.prototype.animate = function ({dur, state}) {
  const self = this;
  let ctx = self.ctx2,
    dim = self.dim,
    projection = self.d3_projection,
    links_by_year = self.store.links_by_year,
    all_links = d3.merge(Object.values(links_by_year)),
    style = Style.links,
    drawLinks = () => Render.drawLinks(all_links, ctx, projection, style)

  if (state && state === "stop") self.animation.stopAnimation()
  else {
    calculateAllPathLens()
    self.animation.startAnimation(ctx, dim, links_by_year, dur, drawLinks)
  }

  function calculateAllPathLens() {
    for (let year in links_by_year) {
      if (!links_by_year.hasOwnProperty(year)) continue
      self.calculateLinksLengthAndSetupLinksInteraction(year)
    }
  }

}

Map.prototype.calculateLinksLengthAndSetupLinksInteraction = function(year) {
  const self = this;
  const projection = self.d3_projection,
    mouseOverLinkF = cat => self.store.event.trigger("updateFocusedMigrationCategory", cat),
    links = self.store.links_by_year[year]

  if (year != self.svg_redered_year) {
    self.svg_redered_year = year
    Dom.calculateLinksLengthAndSetupLinksInteraction(self.svg, links, projection, mouseOverLinkF)
  }
}




