import { Box, Text, Grid, GridItem, keyframes, VStack, List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList, Stack, Image, Link, AspectRatio, Divider} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
function Extracurriculars() {
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
        <GridItem alignContent="center" w="100%" h="100%" bg="white" position="relative" overflowY="auto">
        <VStack spacing={4} textAlign="center">
            <Text
              fontSize="5xl"
              color="gray.800"
              fontWeight="bold"
              animation={`${fadeIn} 0.75s ease-in-out`}
              mt={8}
              mb={4}
              as="b"
            >
              Extracurriculars
            </Text>
            {/* Done */}
            <Box w="75vw" borderRadius="lg" m={5}>
              <Grid templateColumns="60% 35%" h="100%" w="100%" bg="transparent">
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
                    <Text color="gray.900" fontSize="1.5vw" as="b" textAlign="center">
                      OSU AI Club
                    </Text>
                    {/* Centered Subtitle */}
                    <Text color="gray.900" fontSize="1vw" textAlign="center" mb={2}>
                      Technology Committee E Board Member
                    </Text>
                    <Divider mb={2}/>
                    {/* Right-aligned Descriptive Text */}
                    <Text color="gray.900" fontSize="0.9vw" textAlign="left" w="100%">
                      In my 1st year at Ohio State, I joined the OSU AI Club as a general member. During my 2nd year, I became an E Board member where I:
                    </Text>

                    {/* Right-aligned Bullet points */}
                    <UnorderedList spacing={3} fontSize="0.9vw" textAlign="left" w="100%">
                      <ListItem>
                        Taught 70+ students about the fundamentals of deep learning and how to make their own models during Fall of 2023.
                      </ListItem>
                      <ListItem>
                        Walked through how to find and use Hugging Face models for different use cases to 40+ students during Spring of 2024.
                      </ListItem>
                      <ListItem>
                        Assisted with the planning of weekly meetings and the judging, mentoring, and workshops of our yearly hackathon - HackAI.
                      </ListItem>
                      <ListItem>
                        Organized a Python workshop for HackAI 2024 that taught 30+ students how to use Python.
                      </ListItem>
                    </UnorderedList>
                  </VStack>
                </GridItem>

                {/* Right side with image */}
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
                    src="422181673_4039503626276213_4688008092645024820_n.jpg" // Replace with your actual image path
                    position="absolute"
                    objectFit="cover"
                    w="45vw"
                    h="100%"
                    borderRadius="lg"
                    m={8}
                  />
                </GridItem>
              </Grid>
            </Box>

            {/* Done */}
            <Box w="75vw" borderRadius="lg" m={5}>
              <Grid templateColumns="60% 35%" h="100%" w="100%" bg="transparent">
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
                    <Text color="gray.900" fontSize="1.5vw" as="b" textAlign="center">
                      Live Facial Emotion Recognition System
                    </Text>
                    {/* Centered Subtitle */}
                    <Text color="gray.900" fontSize="1vw" textAlign="center" mb={2}>
                      Project Developer
                    </Text>
                    <Divider mb={2}/>
                    {/* Right-aligned Descriptive Text */}
                    <Text color="gray.900" fontSize="0.9vw" textAlign="left" w="100%">
                    As an E Board member of the AI Club tech committee, I designed a deep learning project course. With this, I 
                    </Text>

                    {/* Right-aligned Bullet points */}
                    <UnorderedList spacing={3} fontSize="0.9vw" textAlign="left" w="100%">
                    <ListItem>Designed and implemented a deep learning model using PyTorch to perform real time facial emotion detection.</ListItem>
                      <ListItem>Utilized the FER2013 dataset to train the model, achieving accurate classification of 7 emotions.</ListItem>
                      <ListItem>Implemented real-time face detection and emotion recognition on webcam streams using OpenCV and MTCNN.</ListItem>
                      <ListItem>Developed the workshops based on this project to teach 70+ students at AI Club how to make deep learning models.</ListItem>
                      <ListItem>Link to GitHub repo <Link color="teal" as="b" href="https://github.com/OSU-AI-Club/project-series-2023-resources" isExternal>here</Link>.</ListItem>
                    </UnorderedList>
                  </VStack>
                </GridItem>

                {/* Right side with image */}
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
                    src="News_Image_(47).webp" // Replace with your actual image path
                    position="absolute"
                    objectFit="cover"
                    w="45vw"
                    h="100%"
                    borderRadius="lg"
                    m={8}
                  />
                </GridItem>
              </Grid>
            </Box>

            {/* Done */}
            <Box w="75vw" borderRadius="lg" m={5}>
              <Grid templateColumns="60% 35%" h="100%" w="100%" bg="transparent">
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
                    <Text color="gray.900" fontSize="1.5vw" as="b" textAlign="center">
                    HackAI 2023 2nd Place Win
                    </Text>
                    {/* Centered Subtitle */}
                    <Text color="gray.900" fontSize="1vw" textAlign="center" mb={2}>
                      Project Developer
                    </Text>
                    <Divider mb={2}/>
                    {/* Right-aligned Descriptive Text */}
                    <Text color="gray.900" fontSize="0.9vw" textAlign="left" w="100%">
                    In 2023, 2 of my buddies and I participated in HackAI - the largest AI themed hackathon in Ohio. We converted a DJI Tello into an automated AI surveillance drone for private property protection.
                    </Text>

                    {/* Right-aligned Bullet points */}
                    <UnorderedList spacing={3} fontSize="0.9vw" textAlign="left" w="100%">
                    <ListItem>I assisted in the use of object detection via YoloV5 on the drone camera.</ListItem>
                      <ListItem>I developed an autonomous mapping and flight algorithm utilizing the DJI Tello SDK, NumPy, and MatplotLib.</ListItem>
                      <ListItem>We created an MVP capable of mapped flight and object detection.</ListItem>
                      <ListItem>We achieved 2nd place out of 40 teams and 100+ participants.</ListItem>
                      <ListItem>Link to Pitch deck <Link color="teal" as="b" href="https://pitch.com/v/eagle-ai-tpsmr9" isExternal>here</Link>.</ListItem>
                      <ListItem>Link to GitHub repo <Link color="teal" as="b" href="https://github.com/Rahulnalam1/DroneHackAI23" isExternal>here</Link>.</ListItem>
                    </UnorderedList>
                  </VStack>
                </GridItem>

                {/* Right side with image */}
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
                  <AspectRatio 
                    position="absolute"
                    objectFit="cover"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    m={8}
                  >
                    <video
                      src="HackAIDroneVid.mov" // Replace with your actual local video path
                      controls
                      style={{ width: "100%", height: "100%", borderRadius: "lg" }}
                    />
                  </AspectRatio>
                </GridItem>
              </Grid>
            </Box>

            {/* Done */}
            <Box w="75vw" borderRadius="lg" m={5}>
              <Grid templateColumns="60% 35%" h="100%" w="100%" bg="transparent">
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
                    <Text color="gray.900" fontSize="1.5vw" as="b" textAlign="center">
                    MakeOHI/O 2023 4th Place Win
                    </Text>
                    {/* Centered Subtitle */}
                    <Text color="gray.900" fontSize="1vw" textAlign="center" mb={2}>
                      Project Developer
                    </Text>
                    <Divider mb={2}/>
                    {/* Right-aligned Descriptive Text */}
                    <Text color="gray.900" fontSize="0.9vw" textAlign="left" w="100%">
                    A couple of weeks after HackAI 2023, 3 of my buddies and I entered to compete in MakeOHI/O - Ohio's largest hardware hackathon. Here we developed a search and rescue apparatus that uses an automated rover in conjunction with a automated drone to find and help survivors after disasters.
                    </Text>

                    {/* Right-aligned Bullet points */}
                    <UnorderedList spacing={3} fontSize="0.9vw" textAlign="left" w="100%">
                    <ListItem>I led the efforts of assembling the rover and integrating it with a Raspberry Pi 4B so that the rover’s components may receive instructions.</ListItem>
                      <ListItem>I developed a python script to automate the rover’s capabilities to detect objects and avoid obstacles when driving.</ListItem>
                      <ListItem>We placed 4th out of 60+ teams and 170+ participants.</ListItem>
                      <ListItem>Link to Pitch deck <Link color="teal" as="b" href="https://pitch.com/v/eagle-ai-tpsmr9" isExternal>here</Link>.</ListItem>
                      <ListItem>Link to GitHub repo <Link color="teal" as="b" href="https://github.com/Rahulnalam1/MakeIO23" isExternal>here</Link>.</ListItem>
                    </UnorderedList>
                  </VStack>
                </GridItem>

                {/* Right side with image */}
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
                    src="photo_2023-03-05 07.53.52.jpeg" // Replace with your actual image path
                    position="absolute"
                    objectFit="cover"
                    w="45vw"
                    h="100%"
                    borderRadius="lg"
                    m={8}
                  />
                </GridItem>
              </Grid>
            </Box>

            {/* Done */}
            <Box w="75vw" borderRadius="lg" m={5}>
              <Grid templateColumns="60% 35%" h="100%" w="100%" bg="transparent">
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
                    <Text color="gray.900" fontSize="1.5vw" as="b" textAlign="center">
                    ShowOHI/O 2023 1st Place Win
                    </Text>
                    {/* Centered Subtitle */}
                    <Text color="gray.900" fontSize="1vw" textAlign="center" mb={2}>
                    Project Developer & Presenter
                    </Text>
                    <Divider mb={2}/>
                    {/* Right-aligned Descriptive Text */}
                    <Text color="gray.900" fontSize="0.9vw" textAlign="left" w="100%">
                    After HackAI and MakeOHI/O, my team and I signed up for ShowOHI/O, a showcase where students can present their ideas and work.
                    </Text>

                    {/* Right-aligned Bullet points */}
                    <UnorderedList spacing={3} fontSize="0.9vw" textAlign="left" w="100%">
                    <ListItem>We presented on our AI Drone work being converted for a first responder use case.</ListItem>
                      <ListItem>We developed a business case for how we can use our drone technology to help first responders gather information and go into emergencies with confidence.</ListItem>
                      <ListItem>We displayed the work we had done so far and how we can adapt it for this use case.</ListItem>
                      <ListItem>We placed 1st place out of 15 presenters.</ListItem>
                    </UnorderedList>
                  </VStack>
                </GridItem>

                {/* Right side with image */}
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
                    src="327613376_3502136053389234_8995399919781678967_n.jpg" // Replace with your actual image path
                    position="absolute"
                    objectFit="cover"
                    w="45vw"
                    h="100%"
                    borderRadius="lg"
                    m={8}
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

export default Extracurriculars;

