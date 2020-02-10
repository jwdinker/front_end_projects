const conditionals = {
  inBoundaries: (props) =>
    props.every(({ element, ancestor }) => {
      return element.end >= ancestor.start && element.start <= ancestor.end;
    }),
  isOverflowing: (props) =>
    props.some(({ element, ancestor }) => {
      return (
        (element.start <= ancestor.start && element.end >= ancestor.start) ||
        (element.start <= ancestor.end && element.end >= ancestor.end)
      );
    }),
};

export default conditionals;
