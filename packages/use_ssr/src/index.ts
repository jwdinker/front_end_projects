const isServer = typeof window !== 'undefined';
const isBrowser = !!(typeof window !== 'undefined' && document && document.createElement);

function useSSR() {
  return {
    isServer,
    isBrowser,
  };
}

export default useSSR;
