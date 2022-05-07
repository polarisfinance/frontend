import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useRefresh from './useRefresh';

const useFetchLunarSunriseAPR = () => {
  const [apr, setApr] = useState<number>(0);
  const polarisFinance = usePolarisFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchMasonryAPR() {
      try {
        setApr(await polarisFinance.getLunarSunriseAPR());
      } catch (err) {
        console.error(err);
      }
    }
    fetchMasonryAPR();
  }, [setApr, polarisFinance, slowRefresh]);

  return apr;
};

export default useFetchLunarSunriseAPR;
