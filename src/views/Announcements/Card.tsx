import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
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
    '&:hover': {
      opacity: '70%',
    },
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    verticalAlign: 'middle',
  },
  text: {
    textAlign: 'left',
    maxHeight: '100%',
    minWidth: '70%',
    width: '100%',
    display: 'grid',
    alignItems: 'center',
  },
  modalPlaceholder: {
    position: 'absolute',
    backgroundColor: 'rgb(163,134,192,0.85)',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
  modal: {
    backgroundColor: '#441e76',
    position: 'absolute',
    left: 0,
    fontSize: 'medium',
    marginLeft: '20%',
    marginRight: '20%',
    textAlign: 'left',
    borderRadius: '10px',
    padding: '1em',
  },
  button: {
    border: 'none',
    background: 'none',
    color: 'white',
    fontSize: 'medium',
    '&:hover': {
      opacity: '70%',
    },
  },
});

const formatDate = (date: Date) => {
  return (
    date.getDay().toString().padStart(2, '0') +
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

const ModalBackground = ({ setShowModal }) => {
  const styles = useStyles();

  return <div className={styles.modalPlaceholder} onClick={() => setShowModal(false)}></div>;
};
const Modal = ({ announcement, setShowModal }) => {
  const styles = useStyles();
  const text = announcement.content;
  const img = announcement.image;
  const date = announcement.date;
  const displayedText = text.substring(15);
  const d = new Date(date);

  return (
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
      <div dangerouslySetInnerHTML={{ __html: toHTML(displayedText) }} />
      <br />
      {img !== '' && <img src={img} className={styles.image} alt="Announcement" />}
    </div>
  );
};

const Card = ({ announcement }) => {
  const styles = useStyles();
  const [showModal, setShowModal] = useState(false);
  const text = announcement.content;
  const date = announcement.date;
  const img = announcement.image;
  const displayedText = text.slice(15, 140);
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
          {img !== '' && <img className={styles.image} src={img} alt="Announcement" />}
        </div>
      </div>

      {showModal && (
        <>
          <ModalBackground setShowModal={setShowModal} />
          <Modal announcement={announcement} setShowModal={setShowModal} />
        </>
      )}
    </>
  );
};

export default Card;
