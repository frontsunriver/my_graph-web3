import React from 'react'
import { FormControl, FormLabel, Input } from '@chakra-ui/react'

interface TemplateVariablesProps {
}

export const TemplateVariables: React.FC<TemplateVariablesProps> = ({ }) => {

    const firstFieldRef = React.useRef(null)

    return (
        <>
            <FormControl id="binance-api-key" isRequired>
                <FormLabel>Binance API Key</FormLabel>
                <Input focusBorderColor="brand.400" type="text" />
                {/* <FormHelperText>additionnal informations</FormHelperText> */}
            </FormControl>
            <FormControl id="binance-api-key" isRequired>
                <FormLabel>Smart Contract Address</FormLabel>
                <Input focusBorderColor="brand.400" type="text" />
            </FormControl>
        </>
    )
}