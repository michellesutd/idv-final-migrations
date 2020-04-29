const Data = {};
export default Data;
import "../../MapChart/plugins/topojson-client.js"

Data.loadMigrations = async function () {
  const data_url = "./data/migrations.tsv",
    raw_data = await fetch(data_url).then(resp => resp.text()),
    data = d3.dsvFormat('\t').parse(raw_data);
  return data
}

Data.structureData = function (data) {
  return data
}

Data.getWorldMapGeoJson = async function () {
  let world_map_url = "./data/world.50.geo.json",
    world_map_geo_json = await fetch(world_map_url).then(resp => resp.json());

  world_map_geo_json = topojson.feature(world_map_geo_json,world_map_geo_json.objects["world.50"])
  console.log(world_map_geo_json)
  return world_map_geo_json
}


function group(data, classGetter) {
  const classDict = {}
  data.forEach(d => pushToObjectKey(classDict, classGetter(d), d))
  return classDict

  function fromKeyToGetter(maybeKey) {
    if (typeof maybeKey === "string") return d => d[maybeKey]
    else return maybeKey
  }

  function pushToObjectKey(dct, k, v) {
    if (!dct.hasOwnProperty(k)) dct[k] = []
    dct[k].push(v)
  }
}

