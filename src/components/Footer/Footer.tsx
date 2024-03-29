import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme, useMediaQuery, Container, Grid, Typography, Link } from '@material-ui/core';
import TwitterImage from '../../assets/img/twitter.svg';
import GithubImage from '../../assets/img/github.svg';
import TelegramImage from '../../assets/img/telegram.svg';
import DiscordImage from '../../assets/img/discord.svg';
import MediumImage from '../../assets/img/medium.svg';
import KycBadge from '../../assets/img/KYC-Badge.png';
import ObeliskImage from '../../assets/img/obelisk_audit_logo.png';

const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'absolute',
    bottom: '0',
    paddingTop: '15px',
    paddingBottom: '30px',
    width: '100%',
    color: 'white',

    textAlign: 'center',
    height: '1.3rem',
  },
  link: {
    height: '30px',
    display: 'inline',
    marginLeft: '20px',
  },

  img: {
    height: '30px',
  },

  middle: {
    [theme.breakpoints.down('xs')]: {
      textAlign: 'middle',
    },
    [theme.breakpoints.up('sm')]: {
      textAlign: 'right',
    },
  },
}));

const Footer = () => {
  const classes = useStyles();
  const theme = useTheme();
  const Small = useMediaQuery(theme.breakpoints.down('xs'));
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container>
          {!Small ? (
            <Grid item container xs={4} alignContent="center">
              <Typography variant="body2" color="textSecondary" align="left">
                {'Copyright © '}
                <Link color="inherit" href="/">
                  Polaris Finance
                </Link>{' '}
                {new Date().getFullYear()}
              </Typography>
            </Grid>
          ) : null}
          <Grid item xs={12} sm={8} className={classes.middle}>
            <a
              href="https://obeliskauditing.com/audits/polaris-finance/"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <img alt="medium" src={ObeliskImage} className={classes.img} style={{ paddingBottom: '5px' }} />
            </a>
            <a
              href="https://www.apeoclock.com/launch/polaris-finance-genesis-pools-launch/"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <img alt="medium" src={KycBadge} className={classes.img} />
            </a>
            <a
              href="https://medium.com/@PolarisFinance"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <img alt="medium" src={MediumImage} className={classes.img} />
            </a>
            <a
              href="https://twitter.com/PolarisFinance_"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <img alt="twitter" src={TwitterImage} className={classes.img} />
            </a>
            <a
              href="https://github.com/polarisfinance"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <img alt="github" src={GithubImage} className={classes.img} />
            </a>
            <a href="https://t.me/polarisfinance" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <img alt="telegram" src={TelegramImage} className={classes.img} />
            </a>
            <a
              href="https://discord.com/invite/GCaeBJmZQd"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <img alt="discord" src={DiscordImage} className={classes.img} />
            </a>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
