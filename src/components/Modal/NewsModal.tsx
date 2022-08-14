import { useEffect, useState } from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import NewsImage from './news.png';
import MobileImage from './mobileNews.png';

const useStyles = makeStyles({
  modalPlaceholder: {
    backgroundColor: 'rgb(163,134,192,0.85)',
    overflow: 'scroll',
    cursor: 'pointer',
  },
  modal: {
    backgroundColor: '#441e76',
    width: '80%',
    margin: 'auto',
    marginTop: '5em',
    outline: 'none',
    borderColor: 'white',
    border: 'solid',
    borderRadius: '10px',
    position: 'relative',
    padding: '0.2em',
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  button: {
    border: 'none',
    background: 'none',
    color: 'white',
    outline: 'none',
    '&:hover': {
      opacity: '70%',
    },
    cursor: 'pointer',
    marginRight: '0.2em',
    marginTop: '0.2em',
    fontSize: 'large',
    ['@media (min-width:650px)']: {
      // eslint-disable-line no-useless-computed-key
      marginRight: '1em',
      marginTop: '1em',
      fontSize: '30px',
    },
  },
});

const NewsModal = ({ open, setOpen }) => {
  const [width, setWidth] = useState(window.innerWidth);

  const classes = useStyles();
  const timeOffset = 3 * 24 * 60 * 60 * 1000;

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    if (!localStorage['lastNewsDisplayed']) {
      const d = new Date();
      localStorage.setItem('lastNewsDisplayed', d.getTime().toString());
      setOpen(true);
    } else {
      const currentDate = new Date().getTime();
      const savedDate = new Date(parseInt(localStorage['lastNewsDisplayed'])).getTime();

      if (currentDate - savedDate <= timeOffset) {
        setOpen(false);
      } else {
        const d = new Date();
        localStorage.setItem('lastNewsDisplayed', d.getTime().toString());
        setOpen(true);
      }
    }
  }, []);

  return (
    <Modal open={open} onClose={() => setOpen(false)} className={classes.modalPlaceholder}>
      <div className={classes.modal}>
        <div style={{ position: 'absolute', width: '100%', textAlign: 'right' }}>
          <button className={classes.button} onClick={() => setOpen(false)}>
            X
          </button>
        </div>
        {width >= 650 ? (
          <img className={classes.img} src={NewsImage} alt="News" />
        ) : (
          <img className={classes.img} src={MobileImage} alt="News" />
        )}
      </div>
    </Modal>
  );
};

export default NewsModal;
