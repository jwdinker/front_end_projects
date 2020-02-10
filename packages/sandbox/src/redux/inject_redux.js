import { Provider } from 'react-redux';

let __redux_store__ = null;

function initialize(makeStore, etc) {
  const hasMakeStore = !!makeStore && typeof makeStore === 'function';
  if (!hasMakeStore) {
    throw new Error('In order to initialize the redux store, a makeStore function is required.');
  }
  //On the server, the redux state is recreated everytime.
  //On the client, the state is shared between request.
  const isServer = typeof window === 'undefined';
  if (isServer) {
    return makeStore(etc);
  }

  // Reuse store on the client-side
  if (!__redux_store__) {
    __redux_store__ = makeStore(etc);
  }

  return __redux_store__;
}

function injectRedux(makeStore) {
  /*
      The anonymous function below is the real 'withRedux', however, I
      separated out the creation of the Redux Store because the code is
      already convoluted. Adding it here would just make it more confusing.
  */
  return (Page, { ssr = true, ...props } = {}) => {
    /*
      Unfortunately, I have to use the Page component so 'Redux' has to be nested.
    */
    const Redux = ({ initialReduxState, ...pageProps }) => {
      const store = initialize(makeStore, {
        initialState: initialReduxState,
        ...props,
      });
      return (
        <Provider store={store}>
          <Page {...pageProps} />
        </Provider>
      );
    };

    /*
    getInitialProps
    ---------------
    Enables server-side rendering in a page and allows you to do initial data
    population, it means sending the page with the data already populated from the
    server. This is especially useful for SEO.
    */

    Redux.getInitialProps = async (context) => {
      const store = initialize(makeStore, props);

      // Provide the store to getInitialProps of pages
      context.reduxStore = store;

      const isServer = typeof window === 'undefined';

      // Run getInitialProps from HOCed PageComponent
      const hasPage = typeof Page.getInitialProps === 'function';
      const pageProps = hasPage ? await Page.getInitialProps(context) : {};

      return {
        ...pageProps,
        initialReduxState: store.getState(),
      };
    };

    return Redux;
  };
}

export default injectRedux;
