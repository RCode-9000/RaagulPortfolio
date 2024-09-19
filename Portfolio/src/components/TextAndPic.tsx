import { Text, Stack, Box, Image, Grid, GridItem, keyframes} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom';
import { GraduationCap, Briefcase, TentTree, User, Linkedin, Github, Mail, FileText } from 'lucide-react';

function TextAndPic(props) {
  return (
    <Box w={props.w} h={props.h} borderRadius='lg' bg="grey.100" m={6}>
        {/* <Stack>

            <Image>

            </Image>
        </Stack> */}
        <Grid templateColumns={props.left ? "30% 70%" : "70% 30%"} h="100%" w="100%" bg="grey.100">
            <GridItem w="100%" h="100%" bg="transparent" position="relative" animation={props.animation}>
                {props.left ? (
                    <Image
                    src={props.image} // Replace with your actual image path
                    position="absolute"
                    objectFit="cover"
                    w="100%"
                    h="100%"
                    animation={props.animation}
                    borderRadius='lg'
                    />
                ) : (
                    <Text color="gray.900" m={4} animation={props.animation}>
                    {props.text}
                    </Text>
                )}
            </GridItem>
            <GridItem w="100%" h="100%" bg="transparent" position="relative" animation={props.animation}>
                {props.left ? (
                    <Text color="gray.900" m={4} animation={props.animation}>
                        {props.text}
                    </Text>
                ) : (
                    <Image
                    src={props.image} // Replace with your actual image path
                    position="absolute"
                    objectFit="cover"
                    w="100%"
                    h="100%"
                    animation={props.animation}
                    borderRadius='lg'
                    />
                )}
            </GridItem>
        </Grid>
    </Box>
  );
}

export default TextAndPic;
