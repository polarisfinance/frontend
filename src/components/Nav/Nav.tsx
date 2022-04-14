import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Hidden,
} from '@material-ui/core';
import Image from 'material-ui-image';
import AuroraLogo from '../../assets/img/aurora_logo_white.svg';
import NearLogo from '../../assets/img/near_logo_white.svg';
import Plus from '../../assets/img/+.svg';
import Equal from '../../assets/img/=.svg';
import NameLogo from '../../assets/img/name-logo.svg';
import { Container } from '@material-ui/core';

import ListItemLink from '../ListItemLink';
import newTheme from '../../newTheme';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AccountButton from './AccountButton';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    color: '#FFFFFF',
    'background-color': 'rgba(0, 0, 0, 0)',
    // borderBottom: `1px solid ${theme.palette.divider}`,
    padding: '10px',
    marginBottom: '3rem',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    fontFamily: '"Rajdhani", cursive',
    lineHeight: '20px',
    flexGrow: 1,
  },
  link: {
    textTransform: 'uppercase',
    color: '#FFFFFF',
    fontFamily: '"Rajdhani",regular',
    fontSize: '25px',
    margin: theme.spacing(1, 2),
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
      color: newTheme.palette.primary.main,
    },
  },
  brandLink: {
    textDecoration: 'none',
    color: '#FFFFFF',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  box: {
    flexGrow: 1,
  },
}));

const Nav = () => {
  const matches = useMediaQuery('(min-width:900px)');
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <AppBar position="static" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {matches ? (
          <>
            <Typography variant="h6" color="inherit" className={classes.toolbarTitle}>
              {/* <a className={ classes.brandLink } href="/">Polaris Finance</a> */}
              <Link to="/" color="inherit" className={classes.brandLink}>
                {/*Polaris Finance*/}
                <img src={NameLogo} alt="name_logo" height={35} />
              </Link>
            </Typography>
            <Box className={classes.box} m="auto">
              <Link color="textPrimary" to="/" className={classes.link}>
                Home
              </Link>
              <Link color="textPrimary" to="/dawn" className={classes.link}>
                Dawn
              </Link>
              <Link color="textPrimary" to="/sunrise" className={classes.link}>
                Sunrise
              </Link>
              <Link color="textPrimary" to="/bond" className={classes.link}>
                Bond
              </Link>
              <Link color="textPrimary" to="/strategy" className={classes.link}>
                Strategy
              </Link>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.polarisfinance.io"
                className={classes.link}
              >
                Docs
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.vaporwave.farm/#/aurora"
                className={classes.link}
              >
                AC
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.apeoclock.com/launch/polaris-finance-genesis-pools-launch/"
                className={classes.link}
              >
                KYC
              </a>
            </Box>
            <AccountButton text="Connect" />
          </>
        ) : (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Polaris Finance
            </Typography>

            <Drawer
              className={classes.drawer}
              onEscapeKeyDown={handleDrawerClose}
              onBackdropClick={handleDrawerClose}
              variant="temporary"
              anchor="left"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </div>
              <Divider />
              <List>
                <ListItemLink primary="Home" to="/" />
                <ListItemLink primary="Dawn" to="/dawn" />
                <ListItemLink primary="Sunrise" to="/sunrise" />
                <ListItemLink primary="Bond" to="/bond" />
                <ListItemLink primary="Strategy" to="/strategy" />
                {/* <ListItemLink primary="SBS" to="/sbs" />
                <ListItemLink primary="Liquidity" to="/liquidity" />
                <ListItemLink primary="Regulations" to="/regulations" /> */}
                <ListItem button component="a" href="https://docs.polarisfinance.io">
                  <ListItemText>Docs</ListItemText>
                </ListItem>
                <ListItem button component="a" href="https://www.vaporwave.farm/#/aurora">
                  <ListItemText>AC</ListItemText>
                </ListItem>
                <ListItem
                  button
                  component="a"
                  href="https://www.apeoclock.com/launch/polaris-finance-genesis-pools-launch/"
                >
                  <ListItemText>KYC</ListItemText>
                </ListItem>
                <ListItem style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AccountButton text="Connect" />
                </ListItem>
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
      <Container maxWidth="lg" style={{ marginTop: '10px' }}>
        <Grid container>
          {/* Logo */}
          <Grid container item xs={12} sm={4}>
            {/* <Paper>xs=6 sm=3</Paper> */}
            <Grid item xs={4}>
              <Image
                color="none"
                imageStyle={{ height: '100px' }}
                style={{ height: '100px', paddingTop: '0px', marginTop: '20px' }}
                src={AuroraLogo}
              />
            </Grid>
            <Grid item xs={4}>
              <Image
                color="none"
                imageStyle={{ height: '40px', marginTop: '20px' }}
                style={{ height: '30px', paddingTop: '0px', marginTop: '30px' }}
                src={Plus}
              />
            </Grid>
            <Grid item xs={4}>
              <Image
                color="none"
                imageStyle={{ height: '100px' }}
                style={{ height: '100px', paddingTop: '0px', marginTop: '20px' }}
                src={NearLogo}
              />
            </Grid>
          </Grid>
          <Hidden xsDown>
            <Grid item xs={2} sm={2}>
              {/* <Paper>xs=6 sm=3</Paper> */}
              <Image
                color="none"
                imageStyle={{ height: '20px', marginTop: '20px' }}
                style={{ height: '20px', paddingTop: '0px', marginTop: '40px' }}
                src={Equal}
              />
            </Grid>
          </Hidden>

          <Grid item xs={12} sm={6}>
            {/* <Paper>xs=6 sm=3</Paper> */}
            <Image
              color="none"
              imageStyle={{ height: '100px' }}
              style={{ height: '100px', paddingTop: '0px', marginTop: '20px' }}
              src={NameLogo}
            />
          </Grid>
        </Grid>
      </Container>
    </AppBar>
  );
};

export default Nav;
