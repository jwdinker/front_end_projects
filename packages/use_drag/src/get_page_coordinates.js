function getPageCoordinates(event) {
  const { pageX, pageY } = event.changedTouches ? event.changedTouches[0] : event;
  return [pageX, pageY];
}

export default getPageCoordinates;
