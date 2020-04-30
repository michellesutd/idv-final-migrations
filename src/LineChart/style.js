const Style = {}
export default Style;

Style.style = {
  afr_to_eu: {color: "red"},
  other_to_eu: {color: "blue"},
  afr_to_afr: {color: "yellow"}
}

Style.setupDims = function ({width, height}) {
  const dim = {
    outer_width: width,
    outer_height: height,
    mt: 60,
    mr: 20,
    mb: 5,
    ml: 40
  };
  dim.width = dim.outer_width - dim.ml - dim.mr;
  dim.height = dim.outer_height - dim.mt - dim.mb;

  return dim
}
