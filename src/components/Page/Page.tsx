import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import useEagerConnect from '../../hooks/useEagerConnect';
import NewsModal from '../Modal/NewsModal';

import Footer from '../Footer';
import Nav from '../Nav';
const Page: React.FC = ({ children }) => {
  const [openNews, setOpenNews] = useState(true);

  useEagerConnect();
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Nav openNews={openNews} setOpenNews={setOpenNews} />
      <Container maxWidth="lg" style={{ paddingBottom: '5rem' }}>
        {children}
        <NewsModal open={openNews} setOpen={setOpenNews} />
      </Container>
      <Footer />
    </div>
  );
};

export default Page;
