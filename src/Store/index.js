import Event from "./event/index.js";
import Data from "./data/index.js"

export default function Store() {
  const self = this;
  self.event = new Event();
  self.selected_year = "1990"
  self.focused_migration_category = null;
  self.animateTweens = [];
}

Store.prototype.getData = async function () {
  const self = this;
  self.data = await Data.loadMigrations();
  self.places_data = await Data.loadPlacesData();
  self.world_map_geojson = await Data.getWorldMapGeoJson();
  self.links_by_year = Data.createLinksByYearSubRegions(self.data, self.places_data);
  self.data_by_cat_years = Data.createTotalByCategoriesAndYears(self.data, self.places_data);
}

Store.prototype.structureData = function () {
  const self = this;
  self.data = Data.structureData(self.data)
}

Store.prototype.update = function() {
  const self = this;

}

Store.prototype.updateSelectedYear = function({year, silent}) {
  this.selected_year = year
}
Store.prototype.updateFocusedMigrationCategory = function(cat) {
  this.focused_migration_category = cat
}

Store.prototype.animate = function ({dur, state}) {
  const self = this;
  const years = Object.keys(self.links_by_year),
    mask_rects = document.querySelectorAll("defs rect"),
    slider_handle = document.querySelector(".slider .handle"),
    full_duration = years.length*dur+dur

  if (state && state === "stop") {
    animationStop()
  } else {
    animationStop()
    animateHistogramMask({dur:full_duration, delay:0})
    animateHandleVisibility({dur:.5, delay:full_duration})
  }
  function animateHistogramMask({dur, delay}) {
    mask_rects.forEach(function (el) {
      const width = el.getAttribute("width")
      el.setAttribute("x", -width+"")
      gsap.to(el, dur, {
        attr:{x: 0},
        delay,
        ease: "none",
        onComplete() {
          self.event.trigger("updateSelectedYear", {year: years[years.length-1], silent: false})
        },
      })
    })
  }
  function animateHandleVisibility({dur, delay}) {
    gsap.set(slider_handle, {alpha: 0})
    gsap.to(slider_handle, dur, {alpha: 1, delay})
  }
  
  function animationStop() {
    console.log("Stop")
    mask_rects.forEach(killOnEl)
    killOnEl(slider_handle)

    function killOnEl(el) {
      const tweens = gsap.getTweensOf(el)
      if (tweens.length > 0) tweens.forEach(d => d.totalProgress(1).kill())
    }
  }
}


