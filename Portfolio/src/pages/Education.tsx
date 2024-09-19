import { Box, Text, Grid, GridItem, keyframes, VStack, List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList, Stack, Image, Divider} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import TextAndPic from '../components/TextAndPic';

function Education() {
  const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `;
//   animation={`${fadeIn} 1.5s ease-in-out`}

  let intro = "Hey there! My name is Raagul Sundaralingam, and I'm a 4th year CS student at Ohio State. Throughout my life, I've gained a passion and curiosity for math and engineering, which is why I decided to become a software engineer."
  let education = "I'm currently completing my 4th and final year at Ohio State. I will be graduating in May 2025 with a Bachelors of Science in Computer Science and Engineering with a focus on AI. I will also be receiving a minor in Math."
  let experience = "I'm a undergraduate research assistant at a AI Research lab at Ohio State under Skyler Cranmer. I used to be a software developer for a nonprofit startup called SmileChild."

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
              Education
            </Text>

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
                    The Ohio State University
                    </Text>
                    <Box w="100vw">
                    <Text color="gray.900" fontSize="1vw" textAlign="left" mb={4} mr={8} as="i">
                    Graduating May 2025
                    </Text>
                    <Text color="gray.900" fontSize="1vw" textAlign="right" mb={4} ml={8} as="i">
                    GPA: 3.7
                    </Text>
                    </Box>
                    <Divider />

                    <UnorderedList spacing={3} fontSize="0.9vw" textAlign="left" w="100%">
                      <ListItem>
                      Bachelor of Science in Computer Science & Engineering 
                      </ListItem>
                      <ListItem>
                      Specialization: Artificial Intelligence
                      </ListItem>
                      <ListItem>
                      Minor: Mathematics
                      </ListItem>
                      <ListItem>
                      Relevant Coursework: Software/Web Development, Object-Oriented Programming, Data Structures, Algorithms, Machine Learning, Computer Architecture, Operating Systems, Database Management Systems, Computer Networking, Circuit Design, Calculus, Statistics, and Linear Algebra
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
                    src="ncaa_ohio_state_university_buckeyes.png" // Replace with your actual image path
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
                    Awards
                    </Text>
                    <Divider />
                    <UnorderedList alignItems="center" spacing={3} fontSize="0.9vw" textAlign="left" w="100%">
                      <ListItem>
                      Dean's List
                      </ListItem>
                      <ListItem>
                      1st Place at ShowOHI/O 2023
                      </ListItem>
                      <ListItem>
                      2nd Place at HackAI 2023
                      </ListItem>
                      <ListItem>
                      4th Place at MakeOHI/O 2023
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
                    src="960x0.jpg.webp" // Replace with your actual image path
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

export default Education;
