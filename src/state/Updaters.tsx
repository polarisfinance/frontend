import React from 'react';
import TransactionUpdater from './transactions/updater';
import ApplicationUpdater from './application/updater';

const Updaters = () => (
  <>
    <ApplicationUpdater />
    <TransactionUpdater />
  </>
);

export default Updaters;
