import Store from "./src/Store/index.js"
import Map from "./src/MapChart/models/Map/index.js"
import LineChart from './src/LineChart/index.js'
import Slider from "./src/Slider/index.js"

const store = new Store();
store.event.on("update", store.update.bind(store));
store.event.on("updateSelectedYear", store.updateSelectedYear.bind(store));

async  function initialize() {
  await store.getData();
  store.update()
  {
    const cont = document.querySelector("#map_cont")
    const map = new Map(cont, store);
    map.create()
    map.update()
    store.event.on("update", map.update.bind(map))
    store.event.on("updateSelectedYear", map.drawLinks.bind(map))
  }
  {
    const cont = document.querySelector("#slider_cont")
    const slider = new Slider(cont, store);
    slider.create()
    slider.update()
  }
};
document.addEventListener('DOMContentLoaded', initialize, false);