import React, { useState, useEffect } from 'react';
import { VStack, Box, Flex, Text, Spacer, Alert, Link } from '@chakra-ui/react';
import { GraphCard } from '../components/Graphs/GraphCard';
import { GraphResponse } from '../providers/responses/graph';
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

import GraphService from '../services/graphService';
import { GRAPH_UPDATE } from '../redux/actions';
import { SuspenseSpinner } from '../components/SuspenseSpinner';
import { NavLink } from 'react-router-dom';

interface GraphsProps {

}

const Graphs: React.FC<GraphsProps> = ({ }) => {

    const [reachable, setReacheable] = useState(true)
    const { account } = useWeb3React();
    const dispatch = useDispatch();

    const graphsList: GraphResponse[] = useSelector(
        (state: any) => state.modals.graphs.list
    );

    const loaded: boolean = useSelector(
        (state: any) => state.modals.graphs.loaded
    );

    useEffect(() => {
        const refreshfnc = async () => {
            const graphs: GraphResponse[] | undefined = await GraphService.listGraphs();
            if (graphs === undefined) {
                return setReacheable(false)
             }

            dispatch({
                name: "graphs",
                type: GRAPH_UPDATE,
                payload: { graphs, loaded: true },
            })

            setTimeout(refreshfnc, 10000)
        };

        refreshfnc()
    }, [account])

    return (
        <>
            <h1>
                Graphs
                <Link as={NavLink} to="/app/home" className="bt">
                    New Graph <i className="fal fa-plus-circle"></i>
                </Link>
            </h1>
            <Alert status="info">
                <i className="fal fa-info-circle"></i> 
                <p>Below is the list of your Graphs. You can view logs, stop or delete each one of them.</p>
            </Alert>
            {reachable && !loaded &&
            <SuspenseSpinner/>}
            {!reachable &&
            <Alert status="info">
                <i className="fal fa-times-circle"></i> 
                <p>The engine main-net network can't be reached, please try again later or contact the <i>GraphLinq Support</i>.</p>
            </Alert>
            }
            {graphsList.length == 0 && loaded &&
                <Alert status="info">
                    <i className="fal fa-exclamation-triangle"></i> 
                    <p>You don't have created or deployed any graph yet, refer to our <Box
                            as="a"
                            target="_blank"
                            marginStart="1"
                            href="https://docs.graphlinq.io/graph"
                            color='amber.600'
                            _hover={{ color: 'amber.700' }}
                            display={{ base: 'block', sm: 'revert' }}
                        >documentation</Box> to start your journey.</p>
                </Alert>
            }
            {graphsList.length > 0 &&
            <div className="table">
                <Box py={3} px={8} className="th">
                    <Flex alignItems="center">
                        <Box flex="1 1 0%" display="flex" px={2}>
                            <Text fontSize="xs">Name :</Text>
                            <Spacer />
                        </Box>
                        <Box display="flex" width="48px" minH="48px" justifyContent="center" px={2} />
                        <Box display="flex" width="200px" px={2}>
                            <Text fontSize="xs">Hosted API :</Text>
                            <Spacer />
                        </Box>
                        <Box display="flex" width="200px" px={2}>
                            <Text fontSize="xs">Execution cost :</Text>
                            <Spacer />
                        </Box>
                        <Box display="flex" width="160px" px={2}>
                            <Text fontSize="xs">Running since :</Text>
                            <Spacer />
                        </Box>
                        <Box display="flex" width="160px" px={2}>
                            <Text fontSize="xs">Created :</Text>
                            <Spacer />
                        </Box>
                        <Box display="flex" width="135px" minH="48px" justifyContent="center" px={2} />
                        <Box display="flex" width="40px" minH="48px" justifyContent="center" />
                    </Flex>
                </Box>
                <VStack spacing={8} mb={4}>
                    {graphsList.sort((a: GraphResponse, b: GraphResponse) => { return b.state - a.state }).map((x: GraphResponse, i: number) => {
                        return <GraphCard key={`graph-${i}`} GraphInfo={x} />
                    })}
                </VStack>
            </div>
            }
        </>
    );
}

export default Graphs;