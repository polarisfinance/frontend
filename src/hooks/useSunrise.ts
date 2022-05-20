import { useContext } from 'react';
import { Context as SunriseContext } from '../contexts/Sunrises';
import { Sunrise, ContractName } from '../polaris-finance';

const useSunrise = (contractName: ContractName): Sunrise => {
  const { sunrises } = useContext(SunriseContext);
  return sunrises.find((sunrise) => sunrise.name === contractName);
};

export default useSunrise;
