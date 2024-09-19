import { VStack, Text, Button, Stack, Box } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Linkedin, Github, Mail } from 'lucide-react';

function Navbar() {
  return (
    <VStack spacing={8} textAlign="center">
      {/* Text Section */}
      <Box mb={8}>
        <Text as={RouterLink} to="/" fontSize="1.75vw" color="white" fontWeight="bold" mb={2}>
          Raagul Sundaralingam
        </Text>
        <Text fontSize="1vw" color="white" mt={2}>
          4th Year CSE and AI Student at Ohio State
        </Text>
      </Box>

      {/* Navigation Buttons */}
      <VStack spacing={4}>
        <Button size="lg" as={RouterLink} to="/about-me" colorScheme="teal" variant="ghost" _hover={{ transform: 'scale(1.1)', color: 'white' }} transition="all 0.3s ease">
          About Me
        </Button>
        <Button size="lg" as={RouterLink} to="/education" colorScheme="teal" variant="ghost" _hover={{ transform: "scale(1.1)", color: "white" }} transition="all 0.3s ease">
          Education
        </Button>
        <Button size="lg" as={RouterLink} to="/experience" colorScheme="teal" variant="ghost" _hover={{ transform: "scale(1.1)", color: "white" }} transition="all 0.3s ease">
          Experience
        </Button>
        <Button size="lg" as={RouterLink} to="/extracurriculars" colorScheme="teal" variant="ghost" _hover={{ transform: 'scale(1.1)', color: 'white' }} transition="all 0.3s ease">
          Extracurriculars
        </Button>
        <Button size="lg" as={RouterLink} to="/resume" colorScheme="teal" variant="ghost" _hover={{ transform: 'scale(1.1)', color: 'white' }} transition="all 0.3s ease">
          Resume
        </Button>
      </VStack>

      {/* Social Links */}
      <Box mt={12}>
        <Stack direction="row" spacing={4} align="center">
          <Box
            as="a"
            href="https://www.linkedin.com/in/raagul-sundar/"
            target="_blank"
            rel="noopener noreferrer"
            color="teal"
            _hover={{ transform: "scale(1.1)", color: "white" }}
            transition="all 0.3s ease"
          >
            <Linkedin color="currentColor" size="2.2vw" />
          </Box>
          <Box
            as="a"
            href="https://github.com/RCode-9000"
            target="_blank"
            rel="noopener noreferrer"
            color="teal"
            _hover={{ transform: "scale(1.1)", color: "white" }}
            transition="all 0.3s ease"
          >
            <Github color="currentColor" size="2.2vw" />
          </Box>
          <Box
            as="a"
            href="mailto:raagul9803@gmail.com"
            color="teal"
            _hover={{ transform: "scale(1.1)", color: "white" }}
            transition="all 0.3s ease"
          >
            <Mail color="currentColor" size="2.2vw" />
          </Box>
        </Stack>
      </Box>
    </VStack>
  );
}

export default Navbar;
