import { Alert, Box, Button, Divider, Flex, Input, Progress, Spacer, Stat, StatHelpText, StatLabel, StatNumber, useClipboard, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { usePresaleContract } from '../hooks/useContract';
import { useWeb3React } from "@web3-react/core";
import { utils } from 'ethers';

const GLQRate = 715000

const Presale = () => {

    const [access, setAccess] = React.useState(true);
    const [error, setError] = React.useState("");
    const [pending, setPending] = React.useState("");
    const [success, setSuccess] = React.useState("");

    const { account } = useWeb3React();
    const contract = usePresaleContract(process.env.REACT_APP_PRIVATE_PRESALE_CONTRACT);
    const [addr, setAddr] = React.useState(process.env.REACT_APP_PRIVATE_PRESALE_CONTRACT ?? "")
    const { hasCopied, onCopy } = useClipboard(addr)
    const [raised, setRaised] = React.useState(0)
    const [invested, setInvested] = React.useState(0)
    const [progressRaise, setProgressRaise] = React.useState(0)


    useEffect(() => {
        const refreshRaisedFunds = async () => {
            if (contract == null || !access) return
            try {
                const currentRaised = await contract.getTotalRaisedEth()
                const amount = Number(utils.formatUnits(currentRaised.toString(), 'ether'))
                const progress = (amount / 70) * 100

                const currentInvestment = await contract.getAddressInvestment(account)
                const amountInvested = Number(utils.formatUnits(currentInvestment.toString(), 'ether'))
                
                setRaised(Number(amount))
                setInvested(Number(amountInvested))
                setProgressRaise(progress)
            } catch (e) { console.error(e) }

            setTimeout(refreshRaisedFunds, 10000)
        }
        refreshRaisedFunds()

    }, [account, access])
    
    const claimToken = async () => {
        if (contract == null || !access) return
        setError(""); setSuccess("");
        try {
            setPending("Pending, check your wallet extension to execute the chain transaction...")
            const result = await contract.claimGlq({from: account})
            setPending("Waiting for Ethereum confirmations...")
            await result.wait()
            setSuccess(result.hash)
        }
        catch (e)
        {
            if (e.data?.message) { setPending(""); setError(`Error: ${e.data?.message}`);return; }
            if (e.error?.message) {
                setPending(""); setError(`Error: ${e.error.message}`); return;}
            if (e.message) { setPending(""); setError(`Error: ${e.message}`); }
        }
    }

    return (
        <>
            <Box maxW={{ sm: 'xl' }} mx={{ sm: 'auto' }} w={{ sm: 'full' }}>
                <h1 className="tc">{access ? "Private Pre-sale Round" : "Private Pre-sale Round Access"}</h1>
                <Alert status="info">
                    <i className="fal fa-info-circle"></i>
                    <p>The presale is ended and the smart-contract do not accept any more transactions, do not send Ethereum, 
                        you can buy GLQ from <a target="_blank" rel="noreferrer" href="https://app.uniswap.org/#/swap?inputCurrency=0x9F9c8ec3534c3cE16F928381372BfbFBFb9F4D24">Uniswap</a> or any of our listed CEXs.</p>
                </Alert>
                {error &&
                <Alert status="error">
                    <i className="fal fa-times-circle"></i>
                    <p>{error}</p>
                </Alert>}
                {!success && pending &&
                <Alert status="info">
                    <i className="fal fa-info-circle"></i>
                    <p>{pending}</p>
                </Alert>}
                {success &&
                <Alert status="success">
                    <i className="fal fa-check-circle"></i>
                    <p>You successfully claimed your GLQ tokens from the Private sale, Congratulations!</p>
                    <p><small>Transaction hash : <a href={`https://etherscan.com/tx/${success}`} target="_blank" rel="noreferrer">{success}</a></small></p>
                </Alert>
                }
                <Box className="priv">
                    <VStack
                        align="stretch"
                        mx="auto"
                        maxW="xl"
                        hidden={!access}
                    >
                        <Flex bgGradient="linear(to-r, indigo.500,brand.500)" rounded="md" align="center">
                            <Box>
                                <h3>Claim GLQ Token</h3>
                                <Divider my={2} />
                                <p className="txt">You can claim <Box as="span" fontSize="md" fontWeight="high">{(invested *  GLQRate).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} GLQ = {invested} ETH </Box></p>
                                <p className="txt"><small>After sending ETH to the Presale Contract, Claim your GLQ Token (will be released at Uniswap listing time).</small></p>
                            </Box>
                            <Spacer />
                            <Button className="bt" onClick={claimToken}>
                                Claim Token
                            </Button>
                        </Flex>
                        <Stat className="privb">
                            <StatLabel>1 ETH equals</StatLabel>
                            <StatNumber>~ {GLQRate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} GLQ</StatNumber>
                            <StatHelpText>~ 0.002464$ per GLQ</StatHelpText>
                        </Stat>
                        <Alert status="warning">
                            <i className="fal fa-info-circle"></i>
                            <p>Limited to 1 ETH per wallet</p>
                        </Alert>
                        <p className="txt">
                            The below address is the contract hosted on ETH network for our private presale,
                            you can send ETH on it and will receive automatically the GLQ back.
                        </p>
                        <Divider />
                        <span style={{ paddingTop: 10, float: 'right', color: '#3907ff' }}>
                            <a target="_blank" href="https://graphlinq.io/Cybersecurity_Audit_CTDSEC_GraphLinq_Presale.pdf" rel="noreferrer">
                                &gt; Review the full contract audit here
                                </a>
                            <a style={{marginLeft: "4rem"}} target="_blank" href="https://github.com/GraphLinq/GraphLinq/blob/master/NodeBlock.GraphLinqPrivateSaleContract/contracts/GraphLinqPrivateSale.sol" rel="noreferrer">
                                &gt; View contract github
                                </a>
                        </span>
                        <Flex className="fd in">
                            <Input value={addr} isReadOnly />
                            <Button onClick={onCopy} ml={2} className="sbt">
                                {hasCopied ? "Copied" : "Copy"}
                            </Button>
                        </Flex>
                        <Box>
                            <Progress className="prog" value={progressRaise}/>
                            <p className="txt tc">
                                <small><b>{raised} / 70</b> ETH raised.</small>
                            </p>
                        </Box>
                        <p className="txt">
                            Do not send ETH from exchange address or you may lose your GLQ token!
                        </p>
                        {/* <Alert status="error" rounded="lg">
                            <AlertIcon />
                            Do not send ETH from exchange address or you may lose your GLQ token!
                        </Alert> */}
                    </VStack>
                </Box>
                <Alert status="warning">
                    <i className="fal fa-info-circle"></i>
                    <p>
                        Read our documentation to learn more about the pre-sale process. 
                        
                        <Box
                        target="_blank"
                        as="a"
                        href="https://docs.graphlinq.io/token/3-tokenomics"
                        display={{ base: 'block', sm: 'revert' }}
                        >Read more</Box>
                    </p>
                </Alert>
            </Box>
        </>
    );
}

export default Presale;