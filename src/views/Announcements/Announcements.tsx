import React, { useState } from 'react';
import Card from './Card';

import { MenuItem, Select, Typography } from '@material-ui/core';

import Page from '../../components/Page';
import { Switch } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { Pagination } from '@material-ui/lab';

const ANNOUNCEMENTS = gql`
  query Announcements {
    announcements {
      id
      content
      image
      date
    }
  }
`;

const Announcements = () => {
  const { loading, error, data } = useQuery(ANNOUNCEMENTS);
  const [numPage, setNumPage] = useState(10);
  const [page, setPage] = useState(1);

  const selectChange = (e) => {
    setNumPage(e.target.value);
  };

  if (loading) {
    return <div>loading</div>;
  }
  if (error) {
    return <div>encountered an error: {error}</div>;
  }
  const announcements = data.announcements;

  return (
    <>
      {announcements.slice((page - 1) * numPage, page * numPage).map((announcement, key) => (
        <div key={key}>
          <Card announcement={announcement} />
        </div>
      ))}
      <div
        style={{
          display: 'flex',
          color: 'white',
          fontSize: 'small',
          justifyContent: 'center',
        }}
      >
        <Pagination
          page={page}
          onChange={(e, v) => setPage(v)}
          count={Math.floor(data.announcements.length / numPage) + (data.announcements.length % numPage === 0 ? -1 : 0)}
          variant="outlined"
          shape="rounded"
          siblingCount={1}
          boundaryCount={1}
        />
        <p>Display on page:</p>
        <Select
          value={numPage}
          onChange={selectChange}
          variant={'outlined'}
          style={{ height: 32, width: 55, marginLeft: 5 }}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={10000}>All</MenuItem>
        </Select>
      </div>
    </>
  );
};

const Announcement = () => {
  return (
    <Switch>
      <Page>
        <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
          <> ANNOUNCEMENTS </>
          {Announcements()}
        </Typography>
      </Page>
    </Switch>
  );
};

export default Announcement;
