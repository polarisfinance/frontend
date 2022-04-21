import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import useRefresh from './useRefresh';

const useFetchTripolarSunriseAPR = () => {
  const [apr, setApr] = useState<number>(0);
  const tombFinance = useTombFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchMasonryAPR() {
      try {
        setApr(await tombFinance.getTripolarSunriseAPR());
      } catch (err) {
        console.error(err);
      }
    }
    fetchMasonryAPR();
  }, [setApr, tombFinance, slowRefresh]);

  return apr;
};

export default useFetchTripolarSunriseAPR;
