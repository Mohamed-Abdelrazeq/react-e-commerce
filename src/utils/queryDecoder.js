// to turn everything into an array which is the expected behaviour of my products calling function

function queryDecoder(searchParam) {
  const parsedObject = {};
  for (const [key, val] of searchParam.entries()) {
    if (Array.isArray(parsedObject[key])) {
      parsedObject[key] = [...parsedObject[key], val];
    } else {
      parsedObject[key] = [val];
    }
  }
  return parsedObject;
}

export default queryDecoder;
