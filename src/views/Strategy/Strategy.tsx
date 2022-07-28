import React from 'react';
import Page from '../../components/Page';
import Image from 'material-ui-image';
import Strategy6040 from '../../assets/img/60-40_strategy.png';
import StrategyAlive from '../../assets/img/keep_protocol_alive.png';

const Strategy: React.FC = () => {
  return (
    <Page>
      <Image
        color="none"
        imageStyle={{ height: 'auto', position: 'relative' }}
        style={{ height: 'auto', position: 'relative', paddingTop: '0px' }}
        src={Strategy6040}
        animationDuration={0}
        disableTransition={true}
        disableSpinner={true}
      />
      <Image
        color="none"
        imageStyle={{ height: 'auto', position: 'relative' }}
        style={{ height: 'auto', position: 'relative', paddingTop: '48px' }}
        src={StrategyAlive}
        animationDuration={0}
        disableTransition={true}
        disableSpinner={true}
      />
    </Page>
  );
};

export default Strategy;
