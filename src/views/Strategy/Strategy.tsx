import React from 'react';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/home.png';
import { createGlobalStyle } from 'styled-components';
import Image from 'material-ui-image';
import Strategy6040 from '../../assets/img/60-40_strategy.png';
import StrategyAlive from '../../assets/img/keep_protocol_alive.png';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
    background-position: center center !important;
  }
`;
const Strategy: React.FC = () => {
  return (
    <Page>
      <BackgroundImage />
      <Image
        color="none"
        imageStyle={{ height: 'auto', position: 'relative' }}
        style={{ height: 'auto', position: 'relative', paddingTop: '0px' }}
        src={Strategy6040}
      />
      <Image
        color="none"
        imageStyle={{ height: 'auto', position: 'relative' }}
        style={{ height: 'auto', position: 'relative', paddingTop: '48px' }}
        src={StrategyAlive}
      />
    </Page>
  );
};




export default Strategy;
