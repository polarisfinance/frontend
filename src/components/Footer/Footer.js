import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Link } from '@material-ui/core';
import TwitterImage from '../../assets/img/twitter.svg';
import GithubImage from '../../assets/img/github.svg';
import TelegramImage from '../../assets/img/telegram.svg';
import DiscordImage from '../../assets/img/discord.svg';
import MediumImage from '../../assets/img/medium.svg';

const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'absolute',
    bottom: '0',
    paddingTop: '15px',
    paddingBottom: '15px',
    width: '100%',
    color: 'white',
    backgroundColor: '#2b133e',
    textAlign: 'center',
    height: '1.3rem',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  link: {
    width: '24px',
    height: '24px',
    display: 'inline',
    marginLeft: '20px',
  },

  img: {
    width: '24px',
    height: '24px',
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" align="left">
              {'Copyright © '}
              <Link color="inherit" href="/">
                Polaris Finance
              </Link>{' '}
              {new Date().getFullYear()}
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
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
            <a href="https://discord.gg/x446WTzphe" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <img alt="discord" src={DiscordImage} className={classes.img} />
            </a>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
