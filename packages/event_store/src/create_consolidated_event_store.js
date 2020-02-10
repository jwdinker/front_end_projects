import EventStore from './event_store';

const EVENT_STORE = '__EVENT_STORE__';

function createConsolidatedEventStore(target, storeName = EVENT_STORE) {
  if (!target[storeName]) {
    target[storeName] = new EventStore(target);
  }

  return target[storeName];
}

export default createConsolidatedEventStore;
