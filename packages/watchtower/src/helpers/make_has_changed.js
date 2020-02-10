const makeHasChanged = (props) => {
  return (previous, current) => props.some((prop) => previous[prop] !== current[prop]);
};

export default makeHasChanged;
