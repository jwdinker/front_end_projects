const getVisibleAmount = (element, ancestor) => {
  const distanceX =
    Math.min(ancestor.left, element.left) - Math.max(ancestor.left + ancestor.width, element.left + element.width);
  const distanceY =
    Math.min(ancestor.top, element.top) - Math.max(ancestor.top + ancestor.height, element.top + element.height);
  const visibleX = Math.max(distanceX + ancestor.width + element.width, 0);
  const visibleY = Math.max(distanceY + ancestor.height + element.height, 0);

  const visibleArea = visibleX * visibleY;
  const elementArea = element.width * element.height;

  const visibleAreaPercentage = elementArea === 0 ? 0 : Math.round((visibleArea / elementArea) * 100);
  return {
    pct: visibleAreaPercentage,
    px: [visibleX, visibleY],
  };
};

export default getVisibleAmount;
