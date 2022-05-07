import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useRefresh from './useRefresh';

const useFetchMasonryAPR = (token: string) => {
  const [apr, setApr] = useState<number>(0);
  const polarisFinance = usePolarisFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchMasonryAPR() {
      try {
        setApr(await polarisFinance.getSunriseAPR(token));
      } catch (err) {
        console.error(err);
      }
    }
    fetchMasonryAPR();
  }, [setApr, polarisFinance, slowRefresh, token]);

  return apr;
};

export default useFetchMasonryAPR;
