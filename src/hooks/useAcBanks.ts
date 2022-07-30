import { useContext } from 'react';
import { Context as AcBanksContext } from '../contexts/AcBanks';

const useBanks = () => {
  const { acBanks } = useContext(AcBanksContext);
  return [acBanks];
};

export default useBanks;
