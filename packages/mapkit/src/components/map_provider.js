import React, { Component, useEffect, useRef } from 'react';
import { MapContext } from '../contexts';
import { useInstance } from '../internal';

class MapProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: -1,
    };
    this.setIndex = this.setIndex.bind(this);
  }

  async setIndex(index) {
    this.setState((previousState) => {
      if (previousState.index > -1) {
        throw new Error('MapProvider and withMap only allows for 1 <Map/> child.');
      }
      return { index };
    });
  }

  render() {
    const { index } = this.state;
    const { children } = this.props;
    return (
      <MapContext.Provider value={{ setIndex: this.setIndex, index, hasMapLoaded: index > -1 }}>
        {children}
      </MapContext.Provider>
    );
  }
}

export default MapProvider;
