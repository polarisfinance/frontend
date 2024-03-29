import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
const { toHTML } = require('discord-markdown');

const useStyles = makeStyles({
  placeholder: {
    backgroundColor: '#441e76',
    margin: '1em',
    display: 'flex',
    fontSize: 'medium',
    padding: '0.5em',
    borderRadius: '10px',
    maxHeight: '10em',
    justifyContent: 'space-between',
    overflow: 'hidden',
    top: '0',
    '& a': {
      color: 'white',
      '&:visited': {
        color: 'grey',
      },
    },
    '&:hover': {
      opacity: '70%',
    },
    cursor: 'pointer',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    verticalAlign: 'middle',
    borderRadius: '10px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  text: {
    textAlign: 'left',
    maxHeight: '100%',
    minWidth: '70%',
    width: '100%',
    display: 'grid',
    alignItems: 'top',
  },
  modalPlaceholder: {
    backgroundColor: 'rgb(163,134,192,0.85)',
    overflow: 'scroll',
    cursor: 'pointer',
  },
  modal: {
    backgroundColor: '#441e76',
    width: '80%',
    margin: 'auto',
    color: 'white',
    marginTop: '3em',
    padding: '1em',
    outline: 'none',
    borderRadius: '10px',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    '& a': {
      color: 'white',
      '&:visited': {
        color: 'grey',
      },
    },
    cursor: 'default',
  },
  button: {
    border: 'none',
    background: 'none',
    color: 'white',
    fontSize: 'medium',
    '&:hover': {
      opacity: '70%',
    },
    cursor: 'pointer',
  },
});

const formatDate = (date: Date) => {
  return (
    date.getDate().toString().padStart(2, '0') +
    '.' +
    date.getMonth().toString().padStart(2, '0') +
    '.' +
    date.getFullYear() +
    ' ' +
    date.getHours().toString().padStart(2, '0') +
    ':' +
    date.getMinutes().toString().padStart(2, '0')
  );
};

const convertTimestamps = (text) => {
  const pattern = /<t:[0-9]*(:[t|T|d|D|f|F|R])?>/g;
  const matches = [...text.matchAll(pattern)];
  matches.forEach((match) => {
    const timestamp = match[0].match(/\d/g).join('');
    const date = new Date(timestamp * 1000);
    const formattedDate = formatDate(date);
    text = text.replace(match[0], formattedDate);
  });

  return text;
};

const Card = ({ announcement }) => {
  const styles = useStyles();
  const [showModal, setShowModal] = useState(false);
  var text = convertTimestamps(announcement.content);
  const date = announcement.date;
  const img = announcement.image;
  const displayedText = text.slice(15, 140);
  const displayedFullText = text.slice(15);
  const d = new Date(date);

  return (
    <>
      <div className={styles.placeholder} onClick={() => setShowModal(true)}>
        <div className={styles.text}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>Hey Polarians,</div>
            <div>{formatDate(d)}</div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: toHTML(displayedText) + '...' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right', marginLeft: 10 }}>
          {img !== '' && <img className={styles.image} src={img} alt="Announcement" />}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} className={styles.modalPlaceholder}>
        <div className={styles.modal}>
          <div style={{ width: '100%', textAlign: 'right' }}>
            <button className={styles.button} onClick={() => setShowModal(false)}>
              X
            </button>
          </div>
          <br />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>Hey Polarians,</div>
            <div>{formatDate(d)}</div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: toHTML(displayedFullText) }} />
          <br />
          {img !== '' && <img src={img} className={styles.image} alt="Announcement" />}
        </div>
      </Modal>
    </>
  );
};

export default Card;
