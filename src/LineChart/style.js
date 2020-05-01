const Style = {}
export default Style;

Style.setupDims = function ({width, height}) {
  const dim = {
    outer_width: width,
    outer_height: height,
    mt: 10,
    mr: 40,
    mb: 5,
    ml: 40
  };
  dim.width = dim.outer_width - dim.ml - dim.mr;
  dim.height = dim.outer_height - dim.mt - dim.mb;

  return dim
}
