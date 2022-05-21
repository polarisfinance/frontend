import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useRefresh from './useRefresh';

const useFetchMasonryAPR = (sunrise) => {
  const [apr, setApr] = useState<number>(0);
  const polarisFinance = usePolarisFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchMasonryAPR() {
      try {
        setApr(await polarisFinance.getSunriseAPR(sunrise));
      } catch (err) {
        console.error(err);
      }
    }
    fetchMasonryAPR();
  }, [setApr, polarisFinance, slowRefresh, sunrise?.earnTokenName]);

  return apr;
};

export default useFetchMasonryAPR;
