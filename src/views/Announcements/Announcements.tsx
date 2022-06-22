import React from 'react';
import { useWallet } from 'use-wallet';

import { makeStyles } from '@material-ui/core/styles';

import { Typography, Grid } from '@material-ui/core';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import { createGlobalStyle } from 'styled-components';
import HomeImage from '../../assets/img/home.png';

import useSunrises from '../../hooks/useSunrises';
import Bond from '../Bond';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

// import whichever Apollo hooks you're using
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
const { parser, htmlOutput, toHTML } = require('discord-markdown');

const BackgroundImage = createGlobalStyle`
  body, html {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
    background-position: center center !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
  text: {
    fontSize: '20px',
  },
}));

function Announcements(numberOfAnnouncements: number) {
  const ANNOUNCEMENTS = gql`
  query Announcements {
    announcements(limit: ${numberOfAnnouncements}) {
      id
      content
    }
  }
  `;
  const { loading, error, data } = useQuery(ANNOUNCEMENTS);
  if (loading) {
    return <div>loading</div>;
  }
  if (error) {
    return <div>encountered an error: {error}</div>;
  }
  console.log(data);
  const announcements = data.announcements;
  return (
    <>
      {announcements.map((announcement) => (
        <div dangerouslySetInnerHTML={{ __html: toHTML(announcement.content) }} />
      ))}
    </>
  );
}

const Masonry = () => {
  return (
    <Switch>
      <Page>
        <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
          {Announcements(50)}
        </Typography>
      </Page>
    </Switch>
  );
};

export default Masonry;
