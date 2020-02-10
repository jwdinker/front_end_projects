import { getSupportedEventOptions } from './helpers';

class EventStore {
  constructor(target) {
    this.target = target;
    this.events = new Map();
  }

  publish(name, event) {
    const callbacks = this.events.get(name);
    if (callbacks) {
      callbacks.forEach((callback) => {
        callback(event);
      });
    }
  }

  handle(name) {
    return (event) => this.publish(name, event);
  }

  makeUnsubscribe(indexes, options) {
    return () => {
      Object.keys(indexes).forEach((name) => {
        const index = indexes[name];
        const remainingCallbacks = this.events.get(name);

        if (remainingCallbacks.length > 1) {
          this.events.set(
            name,
            remainingCallbacks.filter((_, _index) => index !== _index)
          );
        } else {
          this.events.delete(name);
          this.target.removeEventListener(name, this.handle(name), options);
        }
      });
    };
  }

  subscribe(types, callback, _options) {
    const names = types.split(' ');
    const options = getSupportedEventOptions(_options);

    const indexes = names.reduce((accumulator, name) => {
      const callbacks = this.events.get(name);
      const hasCallbacks = !!callbacks;
      const index = !hasCallbacks ? 0 : callbacks.length - 1;
      const mergedCallbacks = callbacks ? callbacks.concat(callback) : [callback];

      if (!hasCallbacks) {
        this.target.addEventListener(name, this.handle(name), options);
      }

      this.events.set(name, mergedCallbacks);

      return {
        ...accumulator,
        [name]: index,
      };
    }, {});

    return {
      unsubscribe: this.makeUnsubscribe(indexes, options),
    };
  }
}

export default EventStore;
