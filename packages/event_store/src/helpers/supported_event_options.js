const checkSupportedEventOptions = () => {
  const EVENT_OPTION_TYPES = ['passive', 'once', 'capture'];
  let supportedEventOptions = {};
  const isWindow = typeof window !== 'undefined' && typeof window.addEventListener === 'function';

  if (isWindow) {
    const properties = EVENT_OPTION_TYPES.reduce(
      (accumulator, type) => ({
        ...accumulator,
        [type]: {
          get: () => {
            supportedEventOptions[type] = true;
          },
        },
      }),
      {}
    );

    const options = Object.defineProperties({}, properties);
    const emptyFunction = () => {};
    window.addEventListener('eventOptionSupportChecker', emptyFunction, options);
    window.removeEventListener('eventOptionSupportChecker', emptyFunction, options);
    return supportedEventOptions;
  }
};

const SUPPORTED_EVENTS_OPTIONS = checkSupportedEventOptions();

export default SUPPORTED_EVENTS_OPTIONS;
