import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as TP } from '@material-ui/core/styles';
import { ThemeProvider as TP1 } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';
import usePromptNetwork from './hooks/useNetworkPrompt';
import BanksProvider from './contexts/Banks';
import SunrisesProvider from './contexts/Sunrises';
import PolarisFinanceProvider from './contexts/PolarisFinanceProvider';
import ModalsProvider from './contexts/Modals';
import store from './state';
import theme from './theme';
import newTheme from './newTheme';
import config from './config';
import Updaters from './state/Updaters';
import Loader from './components/Loader';
import Popups from './components/Popups';
import { RefreshContextProvider } from './contexts/RefreshContext';

const Home = lazy(() => import('./views/Home'));
const Dawn = lazy(() => import('./views/Dawn'));
const SunriseSplitter = lazy(() => import('./views/SunriseSplitter'));
const BondSplitter = lazy(() => import('./views/BondSplitter'));
const Strategy = lazy(() => import('./views/Strategy'));
const LegacyDawn = lazy(() => import('./views/LegacyDawn'));
const GenesisDawn = lazy(() => import('./views/GenesisDawn'));
const TripolarSunriseOld = lazy(() => import('./views/TripolarSunriseOld'));

const NoMatch = () => (
  <h3 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    URL Not Found. <a href="/">Go back home.</a>
  </h3>
);

const App: React.FC = () => {
  // Clear localStorage for mobile users
  if (typeof localStorage.version_app === 'undefined' || localStorage.version_app !== '1.1') {
    localStorage.clear();
    localStorage.setItem('connectorId', '');
    localStorage.setItem('version_app', '1.1');
  }

  usePromptNetwork();

  return (
    <Providers>
      <Router>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/dawn">
              <Dawn />
            </Route>
            <Route path="/sunrise">
              <SunriseSplitter />
            </Route>
            <Route path="/tripolar_sunrise_old">
              <TripolarSunriseOld />
            </Route>
            <Route path="/bond">
              <BondSplitter />
            </Route>
            <Route path="/strategy">
              <Strategy />
            </Route>
            <Route path="/legacy_dawn">
              <LegacyDawn />
            </Route>
            {/*
            <Route path="/dawn_splitter">
              <DawnSplitter />
            </Route>
            */}
            <Route path="/genesis_dawn">
              <GenesisDawn />
            </Route>
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </Suspense>
      </Router>
    </Providers>
  );
};

const Providers: React.FC = ({ children }) => {
  return (
    <TP1 theme={theme}>
      <TP theme={newTheme}>
        <UseWalletProvider
          chainId={config.chainId}
          connectors={{
            walletconnect: { rpcUrl: config.defaultProvider },
            walletlink: {
              url: config.defaultProvider,
              appName: 'Polaris Finance',
              appLogoUrl: 'https://polarisfinance.io/logo.png',
            },
          }}
        >
          <Provider store={store}>
            <Updaters />
            <RefreshContextProvider>
              <PolarisFinanceProvider>
                <ModalsProvider>
                  <BanksProvider>
                    <SunrisesProvider>
                      <>
                        <Popups />
                        {children}
                      </>
                    </SunrisesProvider>
                  </BanksProvider>
                </ModalsProvider>
              </PolarisFinanceProvider>
            </RefreshContextProvider>
          </Provider>
        </UseWalletProvider>
      </TP>
    </TP1>
  );
};

export default App;
