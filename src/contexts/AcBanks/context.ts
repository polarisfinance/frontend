import { createContext } from 'react';
import { AcBank } from '../../polaris-finance';

export interface AcBanksContext {
  acBanks: AcBank[];
}

const context = createContext<AcBanksContext>({
  acBanks: [],
});

export default context;
