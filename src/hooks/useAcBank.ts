import { useContext } from 'react';
import { Context as AcBanksContext } from '../contexts/AcBanks';
import { AcBank, ContractName } from '../polaris-finance';

const useBank = (contractName: ContractName): AcBank => {
  const { acBanks } = useContext(AcBanksContext);
  return acBanks.find((bank) => bank.contract === contractName);
};

export default useBank;
