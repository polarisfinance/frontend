import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as TP } from '@material-ui/core/styles';
import { ThemeProvider as TP1 } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';
import usePromptNetwork from './hooks/useNetworkPrompt';
import BanksProvider from './contexts/Banks';
import TombFinanceProvider from './contexts/TombFinanceProvider';
import ModalsProvider from './contexts/Modals';
import store from './state';
import theme from './theme';
import newTheme from './newTheme';
import config from './config';
import Updaters from './state/Updaters';
import Loader from './components/Loader';
import Popups from './components/Popups';
import { RefreshContextProvider } from './contexts/RefreshContext';
import ReactGA from 'react-ga';

const Home = lazy(() => import('./views/Home'));
const Dawn = lazy(() => import('./views/Dawn'));
const SunriseSplitter = lazy(() => import('./views/SunriseSplitter'));
const PolarSunrise = lazy(() => import('./views/Sunrise'));
const LunarSunrise = lazy(() => import('./views/LunarSunrise'));
const Pit = lazy(() => import('./views/Pit'));
const LunarBond = lazy(() => import('./views/LunarBond'));
const BondSplitter = lazy(() => import('./views/Bond_splitter'));
const Strategy = lazy(() => import('./views/Strategy'));
const LegacyDawn = lazy(() => import('./views/LegacyDawn'));
const TripolarSunrise = lazy(() => import('./views/TripolarSunrise'));
const TripolarBond = lazy(() => import('./views/TripolarBond'));
const GenesisDawn = lazy(() => import('./views/GenesisDawn'));
const TripolarSunriseOld = lazy(() => import('./views/TripolarSunriseOld'));

const NoMatch = () => (
  <h3 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    URL Not Found. <a href="/">Go back home.</a>
  </h3>
);

const App: React.FC = () => {
  ReactGA.initialize('G-CMFY1MSGGL');
  ReactGA.pageview(window.location.pathname + window.location.search);

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
            <Route path="/polar_sunrise">
              <PolarSunrise />
            </Route>
            <Route path="/lunar_sunrise">
              <LunarSunrise />
            </Route>
            <Route path="/tripolar_sunrise">
              <TripolarSunrise />
            </Route>
            <Route path="/tripolar_sunrise_old">
              <TripolarSunriseOld />
            </Route>
            <Route path="/bond">
              <BondSplitter />
            </Route>
            <Route path="/polar_bond">
              <Pit />
            </Route>
            <Route path="/lunar_bond">
              <LunarBond />
            </Route>
            <Route path="/tripolar_bond">
              <TripolarBond />
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
              <TombFinanceProvider>
                <ModalsProvider>
                  <BanksProvider>
                    <>
                      <Popups />
                      {children}
                    </>
                  </BanksProvider>
                </ModalsProvider>
              </TombFinanceProvider>
            </RefreshContextProvider>
          </Provider>
        </UseWalletProvider>
      </TP>
    </TP1>
  );
};

export default App;
