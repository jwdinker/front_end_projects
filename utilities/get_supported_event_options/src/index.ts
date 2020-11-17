const EVENT_OPTION_TYPES = ['passive', 'once', 'capture'] as const;

type OptionType = 'passive' | 'once' | 'capture';

export interface EventOptions {
  capture?: boolean;
  passive?: boolean;
  once?: boolean;
}

const checkSupportedEventOptions = () => {
  const supported: OptionType[] = [];
  const properties = {};

  const isWindow = typeof window !== 'undefined' && typeof window.addEventListener === 'function';
  if (isWindow) {
    for (let index = 0; index < EVENT_OPTION_TYPES.length; index += 1) {
      const optionType = EVENT_OPTION_TYPES[index];
      properties[optionType] = {
        get: () => {
          if (supported.indexOf(optionType) === -1) {
            supported.push(optionType);
          }
        },
      };
    }

    const options = Object.defineProperties({}, properties);
    const emptyFunction = () => {};
    window.addEventListener('eventOptionSupportChecker', emptyFunction, options);
    window.removeEventListener('eventOptionSupportChecker', emptyFunction, options);
  }
  return supported;
};

const supportedEventOptions = checkSupportedEventOptions();

const getSupportedEventOptions = (
  options: EventOptions | undefined
): EventOptions | undefined | boolean => {
  if (typeof window === 'undefined' || !options) {
    return undefined;
  }

  const areAllSupported = supportedEventOptions.length === 3;

  if (areAllSupported) {
    return options;
  }
  // If modern event options are not supported, it is infered that only useCapture is supported.
  const isUseCaptureSupported = supportedEventOptions.indexOf('capture') > -1;
  const isCaptureEnabled = options.capture;
  if (isUseCaptureSupported && isCaptureEnabled) {
    return true;
  }
  return undefined;
};

export default getSupportedEventOptions;
