const Data = {};
export default Data;

Data.prepareData = function(data) {
  const line_data = {};
  for (let k in data) {
    if (!data.hasOwnProperty(k)) continue
    line_data[k] = Object.keys(data[k]).map(y => ({date: y, value: data[k][y]}))
  }
  return line_data
}
