import React, {useEffect} from 'react'
import { Box, useRadio, Icon, Flex } from '@chakra-ui/react';
import { FiFile } from 'react-icons/fi';
import TemplateLogo from "../../assets/radio/r-01.svg"
import TemplateLogoSelect from "../../assets/radio/r-04.svg"

interface BlankCardProps {

}

export const BlankCard: React.FC<BlankCardProps> = (props) => {

    return (
         <>
            <div className="lgc">
                <Box
                    className="lg-nsl"
                    h="50px"
                    maxH="50px"
                    bgImage={"url('" + TemplateLogo + "')"}
                    bgPosition="center"
                    bgRepeat="no-repeat"
                />
                <Box
                    className="lg-sl"
                    h="50px"
                    maxH="50px"
                    bgImage={"url('" + TemplateLogoSelect + "')"}
                    bgPosition="center"
                    bgRepeat="no-repeat"
                />
                Blank
            </div>
        </> 
    );
}