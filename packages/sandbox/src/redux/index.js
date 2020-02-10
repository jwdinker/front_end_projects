import withRedux from './with_redux';

function Redux({ children, ...props }) {
  console.log('REDUX PROPS: ', props);
  return children;
}

export default withRedux(Redux);
