import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

import Page from '../../components/Page';
import RegulationsImage from '../../assets/img/regulations_bg.png';
import { createGlobalStyle } from 'styled-components';
import usePolarisFinance from '../../hooks/usePolarisFinance';

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#2c2560',
    fontWeight: 'bolder',
  },
  body: {
    fontSize: 14,
    color: '#2c2560',
  },
}))(TableCell);
const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgb(0,0,0)',
    },
  },
}))(TableRow);

const Regulations = () => {
  const classes = useStyles();
  const polarisFinance = usePolarisFinance();
  const [rows, setRows] = useState(null);
  function createData(epoch, dao, dev, masonry, bondsBought, bondsRedeemed) {
    var sum = (Number(dao) + Number(dev) + Number(masonry)).toFixed(2);
    return { epoch, dao, dev, masonry, sum, bondsBought, bondsRedeemed };
  }
  useEffect(() => {
    if (polarisFinance) {
      const thisData = polarisFinance.listenForRegulationsEvents();
      thisData.then((elements) => {
        setRows(
          elements
            .reverse()
            .map((element) =>
              createData(
                element.epoch,
                element.daoFund,
                element.devFund,
                element.masonryFund,
                element.bondsBought,
                element.bondsRedeemed,
              ),
            ),
        );
      });
    }
  }, [polarisFinance]);

  return (
    <Page>
      <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
        Graveyard regulations
      </Typography>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Epoch</StyledTableCell>
              <StyledTableCell align="center">Masonry funding</StyledTableCell>
              <StyledTableCell align="center">DAO funding</StyledTableCell>
              <StyledTableCell align="center">DEV funding</StyledTableCell>
              <StyledTableCell align="center">Total</StyledTableCell>
              <StyledTableCell align="center">Bonds Bought</StyledTableCell>
              <StyledTableCell align="center">Bonds Redeemed</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row, index) => (
              <StyledTableRow
                style={index % 2 ? { background: 'rgba(0,0,0,0.5)' } : { background: 'rgba(0,0,0,0.5)' }}
                key={row.epoch}
              >
                <StyledTableCell style={{ color: '#2c2560' }} align="center" component="th" scope="row">
                  {row.epoch}
                </StyledTableCell>
                <StyledTableCell align="center">{row.masonry}</StyledTableCell>
                <StyledTableCell align="center">{row.dao}</StyledTableCell>
                <StyledTableCell align="center">{row.dev}</StyledTableCell>
                <StyledTableCell align="center">{row.sum}</StyledTableCell>
                <StyledTableCell align="center">{row.bondsBought}</StyledTableCell>
                <StyledTableCell align="center">{row.bondsRedeemed}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Page>
  );
};

export default Regulations;
