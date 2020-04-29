const fs = require("fs");
const d3 = require("d3");
const fetch = require("node-fetch")

const all_places = getAllPlaces();
iterate(all_places)



function getAllPlaces() {
  let raw_data = fs.readFileSync("../../data/migrations.tsv", "utf8");
  let data = d3.dsvFormat('\t').parse(raw_data);
  console.log(data.columns[8])
  let destionations = [...new Set(data.map(d => d.destination))]
  let origin = data.columns.slice(8)
  let destionation_origin = [...new Set([...destionations, ...origin])]

  return destionation_origin
}

async function iterate(places) {
  const geoCoded = {}
  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    let geo;
    try {
      geo = await search(place);
      console.log(i)
    } catch (e) {
      console.log(e)
    }
    geoCoded[place] = geo
  }
  console.log(geoCoded)
}

function search(q) {
  const search_query = (q) => {
    let url;
    url = "https://nominatim.openstreetmap.org/search?q={0}&format=geocodejson"
    url = url.replace("{0}", encodeURIComponent(q))
    return url
  }

  const url = search_query(q)
  return fetch(url)
    .then(response => response.json())
}