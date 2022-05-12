import { useContext } from 'react';
import { Context as SunriseContext } from '../contexts/Sunrises';

const useSunrises = () => {
  const { sunrises } = useContext(SunriseContext);
  return [sunrises];
};

export default useSunrises;
