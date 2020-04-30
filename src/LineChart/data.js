const Data = {};
export default Data;

Data.setupTotalByYears = function(data) {
  const line_data = [];

  dates.forEach(date => {
    line_data.push({date: new Date(date), value: d3.sum(data, d => d[date])})
  })
  line_data.sort((a, b) => b.date - a.date)
  return {total: line_data}
}
