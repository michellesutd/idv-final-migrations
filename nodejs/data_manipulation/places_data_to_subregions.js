const fs = require("fs");
const d3 = require("d3");

let raw_data = fs.readFileSync("../../data/migrations.tsv", "utf8");
let data = d3.dsvFormat('\t').parse(raw_data);
let places_data = fs.readFileSync("../../data/places_data.json", "utf8");
places_data = JSON.parse(places_data)

const origins_keys = data.columns.slice(8),
  links_by_year = {};

const sub_regions_data = {}
for (let place in places_data) {
  if (!places_data.hasOwnProperty(place)) continue
  const datum = places_data[place],
    subregion = datum.sub_region;
  if (!sub_regions_data.hasOwnProperty(subregion))
    sub_regions_data[subregion] = Object.assign(datum, {place: subregion})
}

fs.writeFileSync("../../data/sub_regions_data.json", JSON.stringify(sub_regions_data))