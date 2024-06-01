import React, { useState, useEffect } from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
} from '@chakra-ui/react'
import RideCard from './Card/RideCard';
import { getRides, getUsersInfo } from '.././Firebase';

  
function LocationDropdown({ name, rides, orgId, eventId, pickupLocationId }) {
    const [rideDetails, setRideDetails] = useState([]);
    const [ridesData, setRidesData] = useState([]);

    useEffect(() => {
        const fetchRides = async () => {
            const rides = await getRides(orgId, eventId, pickupLocationId);

            setRidesData(rides);
        };

        fetchRides();
    }, [orgId, eventId, pickupLocationId]);

    useEffect(() => {
        const fetchRideDetails = async () => {
            try {
                const ridePromises = ridesData.map(async (ride) => {
                    const riders = await getUsersInfo(ride.Riders);
                    return {
                        ...ride,
                        riderNames: riders.map(rider => rider.Name),
                        riderPfps: riders.map(rider => rider.Pfp)
                    };
                });

                const rideDetails = await Promise.all(ridePromises);
                setRideDetails(rideDetails);
            } catch (error) {
                console.error('Error fetching ride details:', error);
            }
        };

        if (ridesData.length > 0) {
            fetchRideDetails();
        }
    }, [ridesData]);

    return (
        <Accordion 
            allowMultiple
            variant='LocationDropdown'
            minW='100%'
        >
            <AccordionItem>
                <AccordionButton>
                    <Box as='span' flex='1' textAlign='left' fontWeight='bold'>
                        {name}
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="20px">
                    {rideDetails.map((ride, index) => (
                        ride && 
                        <RideCard 
                            key={index} 
                            rideImage={ride.Image} 
                            driver={ride.DriverName} 
                            time={ride.PickupTime} 
                            numRiders={ride.NumRiders} 
                            maxRiders={ride.MaxRiders} 
                            ridersNames={ride.riderNames} 
                            riderPfps={ride.riderPfps}
                        />
                    ))}
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}

export default LocationDropdown;