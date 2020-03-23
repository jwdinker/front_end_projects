import { useContext } from 'react';
import Context from './context';
import { WatchTowerContext } from './types';

function useWatchTowerContext(): WatchTowerContext {
  const context = useContext(Context);
  return context;
}

export default useWatchTowerContext;
