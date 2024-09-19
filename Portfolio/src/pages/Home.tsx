import { Link as RouterLink } from 'react-router-dom';
import { Grid, GridItem, Box, VStack, Button, Image, Text, keyframes, Stack } from '@chakra-ui/react';
import { Linkedin, Github, Mail } from 'lucide-react';
import '../App.css';

function Home() {
  // Define the fadeIn keyframes
  const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `;

  return (
    <Box h="100vh" w="100vw" bg="black" overflow="hidden">
      <Grid templateColumns="50% 50%" h="100%" w="100%">
        {/* Left side */}
        <GridItem
          w="100%"
          h="100%"
          bg="gray.900"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          // Apply the animation using a template literal to reference the animation variable
          animation={`${fadeIn} 1s ease-in-out`}
        >
          <VStack spacing={4} textAlign="center">
            <Text
              fontSize="5xl"
              color="white"
              fontWeight="bold"
              animation={`${fadeIn} 1s ease-in-out`}
            >
              Raagul Sundaralingam
            </Text>
            <Text
              fontSize="2xl"
              color="white"
              animation={`${fadeIn} 1s ease-in-out`}
            >
              4th Year CSE and AI Student at Ohio State
            </Text>
            <Stack direction="row" spacing={4} align="center">
              <Button
                as={RouterLink}
                to="/about-me"
                colorScheme="teal"
                variant="ghost"
                _hover={{ transform: 'scale(1.1)', color: 'white' }}
                transition="all 0.3s ease"
                animation={`${fadeIn} 1s ease-in-out`}
              >
                About Me
              </Button>
              <Button
                as={RouterLink}
                to="/education"
                colorScheme="teal"
                variant="ghost"
                _hover={{ transform: 'scale(1.1)', color: 'white' }}
                transition="all 0.3s ease"
                animation={`${fadeIn} 1s ease-in-out`}
              >
                Education
              </Button>
              <Button
                as={RouterLink}
                to="/experience"
                colorScheme="teal"
                variant="ghost"
                _hover={{ transform: 'scale(1.1)', color: 'white' }}
                transition="all 0.3s ease"
                animation={`${fadeIn} 1s ease-in-out`}
              >
                Experience
              </Button>
              <Button
                as={RouterLink}
                to="/extracurriculars"
                colorScheme="teal"
                variant="ghost"
                _hover={{ transform: 'scale(1.1)', color: 'white' }}
                transition="all 0.3s ease"
                animation={`${fadeIn} 1s ease-in-out`}
              >
                Extracurriculars
              </Button>
              <Button
                as={RouterLink}
                to="/resume"
                colorScheme="teal"
                variant="ghost"
                _hover={{ transform: 'scale(1.1)', color: 'white' }}
                transition="all 0.3s ease"
                animation={`${fadeIn} 1s ease-in-out`}
              >
                Resume
              </Button>
            </Stack>
          </VStack>
          <Box position="absolute" bottom="250px">
            <Stack direction="row" spacing={4} align="center">
              <Box
                as="a"
                href="https://www.linkedin.com/in/raagul-sundar/"
                target="_blank"
                rel="noopener noreferrer"
                color="teal"
                _hover={{ transform: 'scale(1.1)', color: 'white' }}
                transition="all 0.3s ease"
                animation={`${fadeIn} 1s ease-in-out`}
              >
                <Linkedin color="currentColor" size={32} />
              </Box>
              <Box
                as="a"
                href="https://github.com/RCode-9000"
                target="_blank"
                rel="noopener noreferrer"
                color="teal"
                _hover={{ transform: 'scale(1.1)', color: 'white' }}
                transition="all 0.3s ease"
                animation={`${fadeIn} 1s ease-in-out`}
              >
                <Github color="currentColor" size={32} />
              </Box>
              <Box
                as="a"
                href="mailto:raagul9803@gmail.com"
                color="teal"
                _hover={{ transform: 'scale(1.1)', color: 'white' }}
                transition="all 0.3s ease"
                animation={`${fadeIn} 1s ease-in-out`}
              >
                <Mail color="currentColor" size={32} />
              </Box>
            </Stack>
          </Box>
        </GridItem>

        {/* Right side */}
        <GridItem
          w="100%"
          h="100%"
          bg="white"
          position="relative"
          animation={`${fadeIn} 1s ease-in-out`}
        >
          <Image
            src="IMG_1988.HEIC" // Replace with your actual image path
            alt="Raagul Sundaralingam"
            position="absolute"
            objectFit="cover"
            w="100%"
            h="100%"
            animation={`${fadeIn} 1s ease-in-out`}
          />
        </GridItem>
      </Grid>
    </Box>
  );
}

export default Home;
