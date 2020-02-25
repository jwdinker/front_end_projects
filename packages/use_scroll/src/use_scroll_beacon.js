import { useContext } from 'react';
import Context from './context';

function useScrollBeacon() {
  const value = useContext(Context);
  return value;
}

export default useScrollBeacon;
