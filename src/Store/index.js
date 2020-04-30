import Event from "./event/index.js";
import Data from "./data/index.js"

export default function Store() {
  const self = this;
  self.event = new Event();
  self.selected_year = "1990"
  self.focused_migration_category = null;
}

Store.prototype.getData = async function () {
  const self = this;
  self.data = await Data.loadMigrations();
  self.places_data = await Data.loadPlacesData();
  self.world_map_geojson = await Data.getWorldMapGeoJson();
  self.links_by_year = Data.createLinksByYearSubRegions(self.data, self.places_data);
  self.data_by_years_and_categories = Data.createTotalByYearsAndCategories(self.data, self.places_data);
}

Store.prototype.structureData = function () {
  const self = this;
  self.data = Data.structureData(self.data)
}

Store.prototype.update = function() {
  const self = this;

}

Store.prototype.updateSelectedYear = function(year) {
  this.selected_year = year
}
Store.prototype.updateFocusedMigrationCategory = function(cat) {
  this.focused_migration_category = cat
}