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
  MapChart.polygons.drawMultiple(self.world_map_geojson.features, d => d, ctx, projection, Style.world_map_bg)
}

Map.prototype.drawLinks = function () {
  const self = this;
  let ctx = self.ctx2,
    dim = self.dim,
    projection = self.d3_projection,
    links_by_year = self.store.links_by_year,
    selected_year = self.store.selected_year,
    links = links_by_year[selected_year],
    focused_migration_category = self.store.focused_migration_category,
    style = Style.links

  self.calculateLinksLengthAndSetupLinksInteraction(selected_year)
  if (focused_migration_category) links = links.filter(d => d.cat === focused_migration_category)
  if (self.timer) self.timer.stop()

  links.forEach(d => {d.t = 1; d.alpha = 1})
  ctx.clearRect(0,0,dim.width, dim.height);
  Render.drawLinks(links, ctx, projection, style);
}

Map.prototype.animateTroughYears = function () {
  const self = this;
  let ctx = self.ctx2,
    dim = self.dim,
    projection = self.d3_projection,
    links_by_year = self.store.links_by_year,
    all_links = d3.merge(Object.values(links_by_year)),
    years = Object.keys(links_by_year),
    style = Style.links,
    dur = 2,
    mouseOverLinkF = cat => self.store.event.trigger("updateFocusedMigrationCategory", cat)
  calculatePathLens();

  for (let i = 0; i < years.length; i++) {
    const links = links_by_year[years[i]],
      delay_spread = dur/(links.length-1)
    if (i > 0) {
      const d = {year: years[i-1]}
      gsap.to(d, dur, {
        year: years[i],
        delay: dur*(i),
        ease: "none",
        onUpdate() {self.store.event.trigger("updateSelectedYear", {year: d.year, silent: true})},
      })
    }
    for (let j = 0; j < links.length; j++) {
      const d = links[j],
        delay = dur*i + (j*delay_spread)
      d.t = 0;
      d.alpha = 1;
      gsap.to(d, dur, {t: 1, delay})
      if (i < years.length-1) gsap.to(d, 1.5, {alpha: 0, delay: delay+1.5})
    }
  }

  if (self.timer) self.timer.stop()
  self.timer = d3.timer(tick)
  function tick(t) {
    if (t > 20*1000) self.timer.stop()
    ctx.clearRect(0,0,dim.width, dim.height);
    Render.drawLinks(all_links, ctx, projection, style);
  }

  function calculatePathLens() {
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

  if (year != self.redered_year) {
    self.svg_redered_year = year
    Dom.calculateLinksLengthAndSetupLinksInteraction(self.svg, links, projection, mouseOverLinkF)
  }
}





