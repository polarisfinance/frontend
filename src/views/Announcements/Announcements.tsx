import React, { useState } from 'react';
import Card from './Card';

import { Typography } from '@material-ui/core';

import Page from '../../components/Page';
import { Switch } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import Modal from '../../components/Modal';
import ModalTitle from '../../components/ModalTitle';

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
      <h3> ANNOUNCEMENTS </h3>
      {announcements.map((announcement) => (
        <>
          <Card text={announcement.content} date={announcement.date} img={announcements.image} />
        </>
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
