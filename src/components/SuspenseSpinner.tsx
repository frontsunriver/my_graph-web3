import { Center, Spinner } from '@chakra-ui/react';
import React from 'react'

interface SuspenseSpinnerProps {

}

export const SuspenseSpinner: React.FC<SuspenseSpinnerProps> = ({ }) => {
    return (
        <Center h="full">
            <Spinner
                thickness="5px"
                speed="0.65s"
                emptyColor="#2334ff"
                color="#15122b"
                size="xl"
            />
        </Center>
    );
}