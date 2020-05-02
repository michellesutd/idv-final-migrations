const Data = {};
export default Data;

Data.prepareData = function(data, categories) {
  const line_data = {};
  categories.forEach(cat => {
    line_data[cat] = Object.keys(data[cat]).map(y => ({date: y, value: data[cat][y]}))
  })
  return line_data
}


