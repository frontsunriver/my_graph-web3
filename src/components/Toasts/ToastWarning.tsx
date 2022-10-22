import React from "react";
import { Box, chakra, Flex, Icon } from "@chakra-ui/react";
import {HiOutlineExclamation} from 'react-icons/hi'

interface ToastWarningProps {
    title?: string
    description?: string
}

export const ToastWarning: React.FC<ToastWarningProps> = (props) => {
  return (
      <Flex
        maxW="sm"
        w="full"
        mx="auto"
        bg="gray.800"
        shadow="md"
        rounded="lg"
        overflow="hidden"
        className="mod"
      >
        <Flex justifyContent="center" alignItems="center" w={12} bg="yellow.500">
          <Icon as={HiOutlineExclamation} color="white" boxSize={6} />
        </Flex>

        <Box mx={-3} py={2} px={4}>
          <Box mx={3}>
            <chakra.span
              color="yellow.400"
              fontWeight="bold"
            >
              {props.title}
            </chakra.span>
            <chakra.p
              color="gray.200"
              fontSize="sm"
            >
              {props.description}
            </chakra.p>
          </Box>
        </Box>
      </Flex>
  );
};
