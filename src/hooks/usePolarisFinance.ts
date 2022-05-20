import { useContext } from 'react';
import { Context } from '../contexts/PolarisFinanceProvider';

const usePolarisFinance = () => {
  const { polarisFinance } = useContext(Context);
  return polarisFinance;
};

export default usePolarisFinance;
