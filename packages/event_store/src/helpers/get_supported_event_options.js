import SUPPORTED_EVENT_OPTIONS from './supported_event_options';

const getSupportedEventOptions = (options) => {
  if (typeof window === 'undefined' || !options) {
    return null;
  }

  const supportedOptions = Object.keys(options).reduce((accumulator, option) => {
    const value = options[option];

    if (SUPPORTED_EVENT_OPTIONS[option]) {
      return {
        ...accumulator,
        [option]: value,
      };
    }
    return accumulator;
  }, null);

  const capture = 'capture' in options ? options.capture : null;
  const isUseCapture = !supportedOptions && capture;
  if (isUseCapture) {
    return true;
  }

  return supportedOptions;
};

export default getSupportedEventOptions;
