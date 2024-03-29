import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as TP } from '@material-ui/core/styles';
import { ThemeProvider as TP1 } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';
import usePromptNetwork from './hooks/useNetworkPrompt';
import BanksProvider from './contexts/Banks';
import SunrisesProvider from './contexts/Sunrises';
import AcBanksProvider from './contexts/AcBanks';
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
import { PhishingWarning } from './components/Alerts';

import * as Realm from 'realm-web';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';

const APP_ID = 'announcements-lsomz';

// Connect to your MongoDB Realm app
const app = new Realm.App(APP_ID);
// Gets a valid Realm user access token to authenticate requests
async function getValidAccessToken() {
  // Guarantee that there's a logged in user with a valid access token
  if (!app.currentUser) {
    // If no user is logged in, log in an anonymous user. The logged in user will have a valid
    // access token.
    await app.logIn(Realm.Credentials.anonymous());
  } else {
    // An already logged in user's access token might be stale. To guarantee that the token is
    // valid, we refresh the user's custom data which also refreshes their access token.
    await app.currentUser.refreshCustomData();
  }
  return app.currentUser.accessToken;
}
// Configure the ApolloClient to connect to your app's GraphQL endpoint

const client = new ApolloClient({
  link: new HttpLink({
    uri: `https://eu-central-1.aws.realm.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`,
    // We define a custom fetch handler for the Apollo client that lets us authenticate GraphQL requests.
    // The function intercepts every Apollo HTTP request and adds an Authorization header with a valid
    // access token before sending the request.

    fetch: async (uri, options) => {
      const requestHeaders: HeadersInit = new Headers();
      const accessToken = await getValidAccessToken();
      requestHeaders.set('Authorization', `Bearer ${accessToken}`);
      options.headers = requestHeaders;
      return fetch(uri, options);
    },
  }),
  cache: new InMemoryCache(),
});

const Home = lazy(() => import('./views/Home'));
const Dawn = lazy(() => import('./views/Dawn'));
const SunriseSplitter = lazy(() => import('./views/SunriseSplitter'));
const LegacySunriseSplitter = lazy(() => import('./views/LegacySunriseSplitter'));
const BondSplitter = lazy(() => import('./views/BondSplitter'));
const Strategy = lazy(() => import('./views/Strategy'));
const LegacyDawn = lazy(() => import('./views/LegacyDawn'));
const Announcements = lazy(() => import('./views/Announcements'));
const Autocompounder = lazy(() => import('./views/Autocompounder'));

//const GenesisDawn = lazy(() => import('./views/GenesisDawn'));
//const DawnSplitter = lazy(() => import('./views/DawnSplitter'));

const NoMatch = () => (
  <h3 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>
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
            <Route path="/legacy_sunrise">
              <LegacySunriseSplitter />
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

            {/* <Route path="/dawn_splitter">
              <DawnSplitter />
            </Route> */}

            <Route path="/announcements">
              <Announcements />
            </Route>
            <Route path="/autocompounder">
              <Autocompounder />
            </Route>
            {/* <Route path="/genesis_dawn">
              <GenesisDawn />
            </Route> */}
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
        <PhishingWarning />
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
                <ApolloProvider client={client}>
                  <ModalsProvider>
                    <BanksProvider>
                      <SunrisesProvider>
                        <AcBanksProvider>
                          <>
                            <Popups />
                            {children}
                          </>
                        </AcBanksProvider>
                      </SunrisesProvider>
                    </BanksProvider>
                  </ModalsProvider>
                </ApolloProvider>
              </PolarisFinanceProvider>
            </RefreshContextProvider>
          </Provider>
        </UseWalletProvider>
      </TP>
    </TP1>
  );
};

export default App;
