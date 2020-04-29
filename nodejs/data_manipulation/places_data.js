const fs = require("fs");
const d3 = require("d3");

let raw_data = fs.readFileSync("../../data/migrations.tsv", "utf8"),
  data = d3.dsvFormat('\t').parse(raw_data),
  geo_coded_points = JSON.parse(fs.readFileSync("../../data/geo_coded_points.json", "utf8")),
  places = data.columns.slice(8);

const places_data = {};

for (let place of places) {
  const place_mig_info = data.find(d => d.destination === place),
    geo_region = place_mig_info["Geographic Region"],
    sub_region = place_mig_info["Sub-region"]

  places_data[place] = {
    place,
    coor: geo_coded_points[place],
    geo_region,
    sub_region
  }

}
fs.writeFileSync("../../data/places_data.json", JSON.stringify(places_data))





