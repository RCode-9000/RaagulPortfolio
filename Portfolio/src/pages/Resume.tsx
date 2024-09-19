import { Box, Grid, GridItem, keyframes } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';

function Resume() {
  const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `;

  // State to force re-render
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Increment key to force re-render
    setKey(prevKey => prevKey + 1);
  }, []);

  return (
    <Box h="100vh" w="100vw" bg="gray.900" overflow="hidden">
      <Grid templateColumns="20% 80%" h="100%" w="100%">
        <GridItem
          w="100%"
          h="100%"
          bg="gray.900"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          animation={`${fadeIn} 0.2s ease-in-out`}
        >
          <Navbar />
        </GridItem>
        <GridItem w="100%" h="100%" bg="white" position="relative">
          <iframe
            key={key}
            src="/Raagul Sundaralingam Resume.pdf"
            style={{ width: '100%', height: '100%' }}
          >
            <p>
              It appears you don't have a PDF plugin for this browser. You can{' '}
              <a href="/Raagul Sundaralingam Resume.pdf" download>
                click here to download the PDF
              </a>
              .
            </p>
          </iframe>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default Resume;
