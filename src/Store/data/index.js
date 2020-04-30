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

Data.createLinksByYearSubRegions = function (data, places_data) {
  const origins_keys = data.columns.slice(8),
    links_by_year_sub_to_sub = getLinksByYearSubToSub(),
    links_by_year = chooseTopNFromSubRegion(links_by_year_sub_to_sub, 2, 100);
  console.log(links_by_year)
  return links_by_year

  
  function getLinksByYearSubToSub() {
    const links_by_year_sub_to_sub = {}
    for (let i = 0; i < data.length; i++) {
      const datum = data[i],
        year = datum.Year,
        destination = datum.destination,
        destination_data = places_data[destination],
        origins = origins_keys.filter(d => +datum[d] > 0);

      for (let j = 0; j < origins.length; j++) {
        const origin = origins[j],
          origin_data = places_data[origin],
          sub_to_sub_key = origin_data.sub_region + "\t" + destination_data.sub_region;
        if (!links_by_year_sub_to_sub.hasOwnProperty(year)) links_by_year_sub_to_sub[year] = {};
        if (!links_by_year_sub_to_sub[year][sub_to_sub_key]) links_by_year_sub_to_sub[year][sub_to_sub_key] = [];
        const link = {
          value: +datum[origin],
          source: origin_data,
          target: destination_data
        }
        const migration_category = getMigrationCategory(link);
        if (!migration_category) continue
        link.cat = migration_category
        links_by_year_sub_to_sub[year][sub_to_sub_key].push(link)
      }

    }
    console.log(links_by_year_sub_to_sub)
    return links_by_year_sub_to_sub
  }

  // TODO: check place data long/lat from google
  function chooseTopNFromSubRegion(links_by_year_sub_to_sub, n, n_year) {
    let links_by_year = {}
    for (let year in links_by_year_sub_to_sub) {
      if (!links_by_year_sub_to_sub.hasOwnProperty(year)) continue
      links_by_year[year] = []
      const links_year = links_by_year_sub_to_sub[year];
      for (let sub_to_sub_key in links_year) {
        if (!links_year.hasOwnProperty(sub_to_sub_key)) continue
        const sub_to_sub_links = links_year[sub_to_sub_key];
        const top_links = sub_to_sub_links.sort((a, b) => b.value - a.value).slice(0, n)
        links_by_year[year].push(...top_links)
      }
    }
    if (n_year) links_by_year = chooseTopLinksByYear(links_by_year, n_year)
    return links_by_year
  }
  function chooseTopLinksByYear(links_by_year, n) {
    for (let year in links_by_year) {
      if (!links_by_year.hasOwnProperty(year)) continue
      links_by_year[year].sort((a, b) => b.value - a.value)
      links_by_year[year] = links_by_year[year].slice(0, n)
    }
    return links_by_year
  }

  function getMigrationCategory(d) {
    if (d.source.geo_region === "Africa" && d.target.geo_region === "Europe") return "afr_to_eu"
    else if (d.source.geo_region !== "Europe" && d.target.geo_region === "Europe") return "other_to_eu"
    else if (d.source.geo_region === "Africa" && d.target.geo_region === "Africa") return "afr_to_afr"
    else return false
  }
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

Data.createTotalByCategoriesAndYears = function (data, places_data) {
  const data_by_years = group(data, d => d.Year),
    all_places = Object.keys(places_data),
    data_by_cat_years = {
      afr_to_eu: {},
      other_to_eu: {},
      afr_to_afr: {}
    }

  for (let year in data_by_years) {
    if (!data_by_years.hasOwnProperty(year)) continue
    data_by_cat_years.afr_to_eu[year] = 0
    data_by_cat_years.other_to_eu[year] = 0
    data_by_cat_years.afr_to_afr[year] = 0

    const year_data = data_by_years[year];
    for (let i = 0; i < year_data.length; i++) {
      const datum = year_data[i];
      data_by_cat_years.afr_to_eu[year] += addIf(datum, d => d === "Africa", d => d === "Europe")
      data_by_cat_years.other_to_eu[year] += addIf(datum, d => d !== "Africa", d => d === "Europe")
      data_by_cat_years.afr_to_afr[year] += addIf(datum, d => d === "Africa", d => d === "Europe")
    }
  }
  return data_by_cat_years

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




