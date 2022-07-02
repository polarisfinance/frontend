import React from 'react';
import Card from './Card';
import { makeStyles } from '@material-ui/core';

import { Typography } from '@material-ui/core';

import Page from '../../components/Page';
import { Switch } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

const useStyles = makeStyles({
  text: {
    '& a': {
      color: 'white',
      '&:visited': {
        color: 'grey',
      },
    },
  },
});
function Announcements(numberOfAnnouncements: number) {
  const styles = useStyles();
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
        <div key={key} className={styles.text}>
          <Card announcement={announcement} />
        </div>
      ))}
    </>
  );
}

const Announcement = () => {
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

export default Announcement;
