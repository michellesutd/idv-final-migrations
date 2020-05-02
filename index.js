import Store from "./src/Store/index.js"
import Map from "./src/MapChart/models/Map/index.js"
import LineChart from './src/LineChart/index.js'
import Slider from "./src/Sliderd3/index.js"

const store = new Store();
store.event.on("update", store.update.bind(store));
store.event.on("updateSelectedYear", store.updateSelectedYear.bind(store));
store.event.on("updateFocusedMigrationCategory", store.updateFocusedMigrationCategory.bind(store));

async  function initialize() {
  await store.getData();
  store.update()
  store.event.on("animate", store.animate.bind(store))
  {
    const cont = document.querySelector("#map_cont")
    const map = new Map(cont, store);
    map.create()
    // map.drawLinks()

    store.event.on("update", map.update.bind(map))
    store.event.on("updateSelectedYear", ({year, silent}) => !silent ? map.drawLinks() : null)
    store.event.on("updateFocusedMigrationCategory", map.drawLinks.bind(map))
    store.event.on("animate", map.animate.bind(map))
  }
  {
    const cont = document.querySelector("#area_cont_up")
    const lineChart = new LineChart(cont, store, {categories: ["other_to_eu", "afr_to_afr"], orientation: "up"});
    lineChart.create()
    lineChart.draw()
    store.event.on("updateFocusedMigrationCategory", lineChart.draw.bind(lineChart));
  }
  {
    const cont = document.querySelector("#slider_cont")
    const slider = new Slider(cont, store);
    slider.create()
    slider.update()
    store.event.on("updateSelectedYear", slider.updateSelectedYear.bind(slider))
  }
  {
    const cont = document.querySelector("#area_cont_down")
    const lineChart = new LineChart(cont, store, {categories: ["afr_to_eu"], orientation: "down"});
    lineChart.create()
    lineChart.draw()
  }
  {
    document.querySelector("#replay_animation").addEventListener("click", function () {
      store.event.trigger("animate", {dur: 2})
    })
  }
  store.event.trigger("animate", {dur: 2})
  store.event.trigger("animate", {dur: 2, state: "stop"})
};
document.addEventListener('DOMContentLoaded', initialize, false);
