import Event from "./event/index.js";
import Data from "./data/index.js"

export default function Store() {
  const self = this;
  self.event = new Event();
  self.selected_year = "1990"
}

Store.prototype.getData = async function () {
  const self = this;
  self.data = await Data.loadMigrations();
  self.places_data = await Data.loadPlacesData();
  self.links_by_year = Data.createLinksByYear(self.data, self.places_data);
  self.world_map_geojson = await Data.getWorldMapGeoJson();
}

Store.prototype.structureData = function () {
  const self = this;
  self.data = Data.structureData(self.data)
}

Store.prototype.update = function() {
  const self = this;

}

Store.prototype.updateSelectedYear = function(year) {
  const self = this;

  self.selected_year = year
}