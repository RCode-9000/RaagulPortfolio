import { Box, Text, Grid, GridItem, keyframes, VStack, List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList, Stack, Image, Link, AspectRatio, Divider} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
function Experience() {
  const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `;

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
            <Navbar></Navbar>
        </GridItem>
        <GridItem w="100%" h="100%" bg="white" position="relative" overflow="scroll">
        <VStack spacing={4} textAlign="center">
            <Text
              fontSize="4vw"
              color="gray.800"
              fontWeight="bold"
              animation={`${fadeIn} 0.75s ease-in-out`}
              mt={8}
              mb={4}
              as="b"
            >
              Experience
            </Text>

            <Box w="75vw" borderRadius="lg" m={5}>
                  <VStack
                    justify="center" // Center vertically
                    p={6}            // Padding inside the container
                    mx="auto"        // Center horizontally
                    w="90%"          // Control the width of the text block
                    spacing={4}      // Space between the elements
                    animation={`${fadeIn} 2s ease-in-out`}
                  >
                    {/* Centered Title */}
                    <Text color="gray.900" w="100%" fontSize="1.5vw" as="b" textAlign="center">
                    Machine Analysis of Political Speech Lab, Ohio State University	
                    </Text>
                    <Box w="100vw">
                    <Text color="gray.900" fontSize="1vw" textAlign="left" mb={4} mr={8} as="i">
                    Undergraduate Research Assistant
                    </Text>
                    <Text color="gray.900" fontSize="1vw" textAlign="right" mb={4} ml={8} as="i">
                    January 2024 - Current
                    </Text>
                    </Box>
                    <Divider />
                    {/* Centered Subtitle */}
                    <UnorderedList spacing={3} fontSize="0.9vw" textAlign="left" w="100%">
                      <ListItem>
                      Joined a AI research lab at Ohio State under <Link color="teal" as="b" href="https://skyler-cranmer.net" isExternal> Dr. Skyler Cranmer</Link>.
                      </ListItem>
                      <ListItem>
                      Working to demonstrate the value different techniques such as Computer Vision and Voice Inflections in facilitating a nuanced analysis of political speech beyond the standard Natural Language Processing techniques being used.
                      </ListItem>
                      <ListItem>
                      Designed and implemented a SQL database to catalog politician profiles, discussed topics, and video segments.
                      </ListItem>
                      <ListItem>
                      Automated data extraction in Python using OpenAI’s WhisperX, HuggingFace’s BGE-M3, and Meta’s Llama-3.
                      </ListItem>
                      <ListItem>
                      Created a prototype capable of digesting 1.5 hour debates into easy to use data into a SQL database in 13 minutes.
                      </ListItem>
                      <ListItem>
                      Building a system that uses this database to perform multi-modal analysis on politician behaviors.
                      </ListItem>
                    </UnorderedList>
                  </VStack>
            </Box>

            <Box w="75vw" borderRadius="lg" m={5}>
              <Grid templateColumns="65% 35%" h="100%" w="100%" bg="transparent">
                {/* Left side with text */}
                <GridItem
                  w="100%"
                  h="100%"
                  bg="transparent"
                  position="relative"
                  animation={`${fadeIn} 2s ease-in-out`}
                >
                  {/* Text content block */}
                  <VStack
                    justify="center" // Center vertically
                    p={6}            // Padding inside the container
                    mx="auto"        // Center horizontally
                    w="90%"          // Control the width of the text block
                    spacing={4}      // Space between the elements
                  >
                    {/* Centered Title */}
                    <Text color="gray.900" w="100%" fontSize="1.5vw" as="b" textAlign="center">
                    Nelt - Newsletter Aggregator
                    </Text>
                    <Box w="100vw">
                    <Text color="gray.900" fontSize="1vw" textAlign="left" mb={4} mr={8} as="i">
                    Software Developer
                    </Text>
                    <Text color="gray.900" fontSize="1vw" textAlign="right" mb={4} ml={8} as="i">
                    April 2024
                    </Text>
                    </Box>
                    <Divider />

                    <UnorderedList spacing={3} fontSize="0.9vw" textAlign="left" w="100%">
                      <ListItem>
                      Developing an app that declutters user email inboxes by moving their newsletter subscriptions into a central hub.
                      </ListItem>
                      <ListItem>
                      Utilized Python Django to facilitate safe and centralized management of user data via an Amazon RDS database.
                      </ListItem>
                      <ListItem>
                      Employed React.js to implement the framework for an intuitive and effective user experience.
                      </ListItem>
                      <ListItem>
                      Implemented core functionality by using the Gmail API in Python to automate the retrieval of newsletters.
                      </ListItem>
                      <ListItem>
                      Setting up a CI/CD pipeline on Google Cloud Platform for public release and updates.
                      </ListItem>
                    </UnorderedList>
                  </VStack>
                </GridItem>

                <GridItem
                  w="100%"
                  h="100%"
                  bg="transparent"
                  position="relative"
                  display="flex"  // Added this line to enable flexbox
                  alignItems="center"  // Center vertically
                  justifyContent="center"  // Center horizontally
                  animation={`${fadeIn} 2s ease-in-out`}
                >
                  <Image
                    src="Image 6-7-24 at 9.37 PM.JPG" // Replace with your actual image path
                    position="relative"
                    objectFit="cover"
                    w="45vw"
                    h="45vh"
                    borderRadius="lg"
                    m={8}
                    justifyContent="center"
                  />
                </GridItem>

              </Grid>
            </Box>

            <Box w="75vw" borderRadius="lg" m={5}>
              <Grid templateColumns="65% 35%" h="100%" w="100%" bg="transparent">
                {/* Left side with text */}
                <GridItem
                  w="100%"
                  h="100%"
                  bg="transparent"
                  position="relative"
                  animation={`${fadeIn} 2s ease-in-out`}
                >
                  {/* Text content block */}
                  <VStack
                    justify="center" // Center vertically
                    p={6}            // Padding inside the container
                    mx="auto"        // Center horizontally
                    w="90%"          // Control the width of the text block
                    spacing={4}      // Space between the elements
                  >
                    {/* Centered Title */}
                    <Text color="gray.900" w="100%" fontSize="1.5vw" as="b" textAlign="center">
                    SmileChild
                    </Text>
                    <Box w="100vw">
                    <Text color="gray.900" fontSize="1vw" textAlign="left" mb={4} mr={8} as="i">
                    Software Developer
                    </Text>
                    <Text color="gray.900" fontSize="1vw" textAlign="right" mb={4} ml={8} as="i">
                    May 2023 - April 2024
                    </Text>
                    </Box>
                    <Divider />

                    <UnorderedList spacing={3} fontSize="0.9vw" textAlign="left" w="100%">
                      <ListItem>
                      Developed an educational iOS application for a nonprofit startup aiming to fight infant mortality.
                      </ListItem>
                      <ListItem>
                      Built interactive and educational games within the app using React Native to help users learn about child bearing.
                      </ListItem>
                      <ListItem>
                      Debugged pre-existing games for better functionality and usability; added a review navigation feature to help users learn better if they got incorrect answers; prepared the app for a marketing study.
                      </ListItem>
                      <ListItem>
                      Improved the app’s overall user experience, enhancing its effectiveness and readiness for marketing.
                      </ListItem>
                    </UnorderedList>
                  </VStack>
                </GridItem>

                <GridItem
                  w="100%"
                  h="100%"
                  bg="transparent"
                  position="relative"
                  display="flex"  // Added this line to enable flexbox
                  alignItems="center"  // Center vertically
                  justifyContent="center"  // Center horizontally
                  animation={`${fadeIn} 2s ease-in-out`}
                >
                  <Image
                    src="smile_child_logo.jpeg" // Replace with your actual image path
                    position="relative"
                    objectFit="cover"
                    w="45vw"
                    h="45vh"
                    borderRadius="lg"
                    m={8}
                    justifyContent="center"
                  />
                </GridItem>

              </Grid>
            </Box>
            
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default Experience;

