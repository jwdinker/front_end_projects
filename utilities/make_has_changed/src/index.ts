function makeHasChanged(props: string[]) {
  return <P, C>(previous: P, current: C): boolean => {
    return props.some((prop) => {
      return previous[prop] !== current[prop];
    });
  };
}

export default makeHasChanged;
