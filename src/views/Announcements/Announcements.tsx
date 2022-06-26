import React from 'react';
import Card from './Card';

import { Typography } from '@material-ui/core';

import Page from '../../components/Page';
import { Switch } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

function Announcements(numberOfAnnouncements: number) {
  const ANNOUNCEMENTS = gql`
  query Announcements {
    announcements(limit: ${numberOfAnnouncements}) {
      id
      content
      image
      date
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
  const announcements = data.announcements;

  return (
    <>
      {announcements.map((announcement, key) => (
        <div key={key}>
          <Card announcement={announcement} />
        </div>
      ))}
    </>
  );
}

const Masonry = () => {
  return (
    <Switch>
      <Page>
        <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
          <h3> ANNOUNCEMENTS </h3>
          {Announcements(50)}
        </Typography>
      </Page>
    </Switch>
  );
};

export default Masonry;
