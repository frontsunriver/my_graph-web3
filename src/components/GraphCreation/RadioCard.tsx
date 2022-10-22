import React from 'react'
import { Box, useRadio } from '@chakra-ui/react';

export const RadioCard = (props: any) => {
    const { getInputProps, getCheckboxProps } = useRadio(props) //(props)

    const input = getInputProps()
    const checkbox = getCheckboxProps()

    return (
        <Box as="label" w={["100%", "50%", "50%", "33.333%", "20%"]}>
            <input {...input} />
            {!props.fileLoaded && props.clickable ? 
            <Box
                {...checkbox}
                maxW="sm"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                cursor="pointer"
                _checked={{
                    borderWidth:"2px",
                }}>
                {props.children}
           </Box>
           :
             <Box
                // disabled
                // cursor="not-allowed"
                {...checkbox}
                maxW="sm"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                _checked={{
                    borderWidth:"2px",
                }}>
                
                {props.children}
                
            </Box>
            }
        </Box>
    );
}