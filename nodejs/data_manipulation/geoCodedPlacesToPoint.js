const fs = require("fs");

let raw_data = fs.readFileSync("../../data/geo_coded.json", "utf8");
let geo_coded_data = JSON.parse(raw_data);

const geo_coded_points = {}
for (let place in geo_coded_data) {
  if (!geo_coded_data.hasOwnProperty(place)) continue
  if (geo_coded_data[place].features.length === 0) continue
  const geo = geo_coded_data[place],
    point = geo.features[0].geometry;
  geo_coded_points[place] = point.coordinates;
  if (point.type !== "Point")
    console.log("denis")
}

fs.writeFileSync("../../data/geo_coded_points.json", JSON.stringify(geo_coded_points))






