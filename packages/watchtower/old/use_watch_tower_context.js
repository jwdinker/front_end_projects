import { useContext } from 'react';
import Context from './context';

function useWatchTowerContext() {
  const context = useContext(Context);
  return context;
}

export default useWatchTowerContext;
