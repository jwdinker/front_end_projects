const filterEdges = (props) => {
  const at = [];
  for (let i = 0; i < 2; i++) {
    const { element, ancestor, position } = props[i];

    const isAtStart = element.start <= ancestor.start && element.end >= ancestor.start;
    const isAtEnd = element.start <= ancestor.end && element.end >= ancestor.end;

    if (isAtStart) {
      at.push(position.start);
    }
    if (isAtEnd) {
      at.push(position.end);
    }
  }
  return at;
};

export default filterEdges;
