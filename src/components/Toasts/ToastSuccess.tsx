import React from "react";
import { Box, chakra, Flex, Icon } from "@chakra-ui/react";
import {HiOutlineCheckCircle} from 'react-icons/hi'
import { isLineBreak } from "typescript";

interface ToastSuccessProps {
    title?: string
    description?: string
    isLink?: boolean
}

export const ToastSuccess: React.FC<ToastSuccessProps> = (props) => {
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
        <Flex justifyContent="center" alignItems="center" w={12} bg="green.500">
          <Icon as={HiOutlineCheckCircle} color="white" boxSize={6} />
        </Flex>

        <Box mx={-3} py={2} px={4}>
          <Box mx={3}>
            <chakra.span
              color="green.400"
              fontWeight="bold"
            >
              {props.title}
            </chakra.span>
            <chakra.p
              color="gray.200"
              fontSize="sm"
            >
                { props.isLink
                ? props.description
                : <p>Transaction hash : <a href={`https://etherscan.com/tx/${props.description}`} target="_blank">{props.description}</a></p>
                }
            </chakra.p>
          </Box>
        </Box>
      </Flex>
  );
};
