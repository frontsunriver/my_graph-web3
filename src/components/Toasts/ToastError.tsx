import React from "react";
import { Box, chakra, Flex, Icon } from "@chakra-ui/react";
import {HiOutlineXCircle} from 'react-icons/hi'

interface ToastErrorProps {
    title?: string
    description?: string
}

export const ToastError: React.FC<ToastErrorProps> = (props) => {
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
        <Flex justifyContent="center" alignItems="center" w={12} bg="red.500">
          <Icon as={HiOutlineXCircle} color="white" boxSize={6} />
        </Flex>

        <Box mx={-3} py={2} px={4}>
          <Box mx={3}>
            <chakra.span
              color="red.400"
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
