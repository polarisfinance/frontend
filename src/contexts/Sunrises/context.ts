import { createContext } from 'react';
import { Sunrise } from '../../polaris-finance';

export interface BanksContext {
  sunrises: Sunrise[];
}

const context = createContext<BanksContext>({
  sunrises: [],
});

export default context;
