const Data = {};
export default Data;
import "../../MapChart/plugins/topojson-client.js"

Data.loadMigrations = async function () {
  const data_url = "./data/migrations.tsv",
    raw_data = await fetch(data_url).then(resp => resp.text()),
    data = d3.dsvFormat('\t').parse(raw_data);
  return data
}

Data.loadPlacesData = async function () {
  const data_url = "./data/places_data.json",
    places_data = await fetch(data_url).then(resp => resp.json());
  return places_data
}

Data.createDataByYear = function (data) {
  const origins_keys = data.columns.slice(8),
    dataByYear = {};

  for (let i = 0; i < data.length; i++) {
    const datum = data[i],
      year = datum.Year,
      destination = datum.destination,
      origins = origins_keys.map(origin => ({origin, value: +datum[origin]})).filter(d => d.value > 0),
      total = datum.Total

    if (!dataByYear.hasOwnProperty(year)) dataByYear[year] = [];
    dataByYear[year].push({
      destination, origins, total
    })
  }
  return data
}

Data.createLinksByYear = function (data, places_data) {
  const origins_keys = data.columns.slice(8),
    links_by_year = {};

  for (let i = 0; i < data.length; i++) {
    const datum = data[i],
      year = datum.Year,
      destination = datum.destination,
      destination_data = places_data[destination],
      origins = origins_keys.filter(d => +datum[d] > 0);

    for (let j = 0; j < origins.length; j++) {
      const origin = origins[j],
        origin_data = places_data[origin]
      if (!links_by_year.hasOwnProperty(year)) links_by_year[year] = [];
      links_by_year[year].push({
        source: origin_data,
        target: destination_data
      })
    }

  }
  return links_by_year
}

Data.getWorldMapGeoJson = async function () {
  let world_map_url = "./data/world.50.geo.json",
    world_map_geo_json = await fetch(world_map_url).then(resp => resp.json());

  world_map_geo_json = topojson.feature(world_map_geo_json,world_map_geo_json.objects["world.50"])
  console.log(world_map_geo_json)
  return world_map_geo_json
}

Data.getWorldMapLandGeoJson = async function () {
  let world_map_url = "./data/world_land.geo.json",
    world_map_geo_json = await fetch(world_map_url).then(resp => resp.json());

  world_map_geo_json = {features: [world_map_geo_json]}
  console.log(world_map_geo_json)
  return world_map_geo_json
}

Data.createTotalByYearsAndCategories = function (data, places_data) {
  const data_by_years = group(data, d => d.Year),
    all_places = Object.keys(places_data),
    data_by_years_and_categories = {}

  for (let year in data_by_years) {
    if (!data_by_years.hasOwnProperty(year)) continue
    data_by_years_and_categories[year] = {
      afr_to_eu: 0,
      other_to_eu: 0,
      afr_to_afr: 0
    }
    const year_data = data_by_years[year];
    for (let i = 0; i < year_data.length; i++) {
      const datum = year_data[i];
      data_by_years_and_categories[year].afr_to_eu += addIf(datum, d => d === "Africa", d => d === "Europe")
      data_by_years_and_categories[year].other_to_eu += addIf(datum, d => d !== "Africa", d => d === "Europe")
      data_by_years_and_categories[year].afr_to_afr += addIf(datum, d => d === "Africa", d => d === "Europe")
    }
  }
  return data_by_years_and_categories

  function addIf(datum, checkSourceGeo, checkTargetGeo) {
    let destination_total = 0
    if (checkSourceGeo(datum["Geographic Region"])) return destination_total
    all_places.forEach(place => {
      if (checkTargetGeo(place["Geographic Region"])) return
      destination_total += +datum[place]
    })
    return destination_total
  }

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

