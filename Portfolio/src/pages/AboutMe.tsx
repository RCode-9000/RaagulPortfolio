import { Box, Text, Grid, GridItem, keyframes, VStack, List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList, Stack, Image} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import TextAndPic from '../components/TextAndPic';

function AboutMe() {
  const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `;
//   animation={`${fadeIn} 1.5s ease-in-out`}

  let intro = "Hey there! My name is Raagul Sundaralingam, and I'm a 4th year CS student at Ohio State. Throughout my life, I've gained a passion and curiosity for math and engineering, which is why I decided to become a software engineer."

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
              About Me
            </Text>

            <VStack
              justify="center" // Center vertically            // Padding inside the container
              mx="auto"        // Center horizontally
              w="90%"          // Control the width of the text block
              spacing={4}      // Space between the elements
            >
              <Text color="gray.900" textAlign="left" m={4} animation={`${fadeIn} 1s ease-in-out`}>
                  Hey there! My name is Raagul Sundaralingam
              </Text>
              <UnorderedList animation={`${fadeIn} 1s ease-in-out`} textAlign="left">
                  <ListItem>4th year CS student at Ohio State.</ListItem>
                  <ListItem>Specializing in AI</ListItem>
                  <ListItem>Natural curiosity for STEM</ListItem>
                  <ListItem>Strong passion for creating impactful solutions</ListItem>
                  <ListItem>Career Goal: work with brilliant people in a vibrant environment on an groundbreaking product</ListItem>
              </UnorderedList>

              <Image
                src="IMG_3859.HEIC" // Replace with your actual image path
                position="relative"
                objectFit="contain"
                w="65vw"
                h="50vh"
                borderRadius="lg"
                m={8}
                justifyContent="center"
                animation={`${fadeIn} 1.5s ease-in-out`}
              />

            </VStack>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default AboutMe;
