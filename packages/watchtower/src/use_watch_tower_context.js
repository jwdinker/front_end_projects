import Context from './context';
import { useContext } from 'react';

function useWatchTowerContext() {
  const context = useContext(Context);
  return context;
}

export default useWatchTowerContext;
