import { 
    Card, 
    CardHeader, 
    CardBody, 
    Image, 
    Stack, 
    Text,
    useTheme,
    Spacer
} from '@chakra-ui/react'
import {
    List,
    ListItem,
    ListIcon,
} from '@chakra-ui/react'
import { IoMdPerson } from "react-icons/io";


function RideCard() {
    const theme = useTheme();
    const primary = theme.colors.primary; 
    const secondary = theme.colors.secondary; 
    const textPrimary = theme.colors.textPrimary; 
    const textSecondary = theme.colors.textSecondary;

    return (
        <Card
            direction='row'
            overflow='hidden'
            variant='RideCard'
            maxW='90%'
        >
            <Image
                objectFit='cover'
                maxW={{ base: '33%', sm: '130px' }}
                src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                alt='Caffe Latte'
            />

                <Stack gap='0px'>
                    <CardHeader pt='5px' pb='5px' pl='10px'>
                        <Text align='left' fontWeight='bold' fontSize='lg' color={textPrimary}>John Ahn</Text>
                    </CardHeader>

                    <CardBody pt='0px' pl='10px'>
                        <Text align='left' fontSize='sm' color={textSecondary}>
                            Pick up: 1:25 PM
                        </Text>
                    </CardBody>
                </Stack>

                <Spacer />

                <Stack gap='0px'>
                    <CardHeader pt='5px' pb='5px' display='flex' alignItems='center' justifyContent='center'>
                        <IoMdPerson/>
                        <Text fontWeight='bold' fontSize='lg' color={textPrimary}>4/4</Text>
                    </CardHeader>

                    <CardBody pt='0px' px='2px' pb='10px'>
                        <List align='left' fontSize='10px' color={textPrimary}>
                            <ListItem>
                                <ListIcon as={IoMdPerson} color={textPrimary} />
                                Serena Oh
                            </ListItem>
                            <ListItem>
                                <ListIcon as={IoMdPerson} color={textPrimary} />
                                Nathan Liow
                            </ListItem>
                            <ListItem>
                                <ListIcon as={IoMdPerson} color={textPrimary} />
                                Joe Mama
                            </ListItem>
                            <ListItem>
                                <ListIcon as={IoMdPerson} color={textPrimary} />
                                Hehe Eee
                            </ListItem>
                        </List>
                    </CardBody>
                </Stack>
        </Card>
    )
}

export default RideCard;