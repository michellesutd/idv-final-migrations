import Store from "./src/Store/index.js"
import Map from "./src/MapChart/models/Map/index.js"

const store = new Store();

store.event.on("update", store.update.bind(store));

(async () => {
  await store.getData();
  store.update()
  {
    const cont = document.querySelector("#map_cont")
    const map = new Map(cont, store);
    map.create()
    map.update()
    store.event.on("update", map.update.bind(map))
  }
})();