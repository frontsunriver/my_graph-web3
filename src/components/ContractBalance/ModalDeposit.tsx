import React, { useState } from 'react'
import { Button, Icon, Text, Alert, AlertDescription, AlertIcon, AlertTitle, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, useDisclosure } from '@chakra-ui/react';
import { FiArrowUpRight } from 'react-icons/fi';
import { useBalanceContract, useTokenContract } from '../../hooks/useContract';
import { getDecimalsAmount } from '../../utils';
import { useActiveWeb3React } from '../../hooks';
import { utils } from 'ethers';
import { useBalance } from '../../hooks/useBalance';
import { useWalletContract } from '../../hooks/useWalletContract';

interface ModalDepositProps {

}

export const ModalDeposit: React.FC<ModalDepositProps> = ({ }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const finalRef = React.useRef()
    const contract = useBalanceContract(process.env.REACT_APP_GRAPHLINQ_BALANCE_CONTRACT);
    const tokenContract = useTokenContract(process.env.REACT_APP_GRAPHLINQ_TOKEN_CONTRACT)


    const {balance, refreshBalance} =  useBalance();
    const {refreshBalanceContract} =  useWalletContract();
    
    const { account } = useActiveWeb3React()
    const [amountDeposit, setAmountDeposit] = useState("0.0");
    const [error, setError] = useState("");
    const [pending, setPending] = useState("");
    const [success, setSuccess] = useState("");


    const format = (val: string) => val + ` GLQ`;
    const parse = (val: string) => val.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1');

    async function doDeposit()
    {
        if (contract == null || tokenContract == null) { return }
        refreshBalance()

        const asNumber: number = parseFloat(amountDeposit)
        if (asNumber <= 0) {
            setError(`Invalid amount to deposit on the balance contract: ${asNumber} GLQ`)
            return 
        }
        
        const decimalAmount: any = utils.parseEther(amountDeposit)
        try {
            const allowance = await tokenContract.allowance(account, process.env.REACT_APP_GRAPHLINQ_BALANCE_CONTRACT);
            const wei = utils.parseEther('10000000')
            if (parseFloat(allowance) < parseFloat(decimalAmount)) {
                console.log(`${allowance} vs ${decimalAmount}`)
                setPending("Allowance pending, please allow the use of your token balance for the contract...")
                const approveTx = await tokenContract.approve(process.env.REACT_APP_GRAPHLINQ_BALANCE_CONTRACT, wei.toString());
                setPending("Waiting for confirmations...")
                await approveTx.wait()
                setPending("Allowance successfully increased, waiting for deposit transaction...")
            }
            const currentBalanceDecimal: any = utils.parseEther(balance.amount.toString())
            if (parseFloat(decimalAmount) > parseFloat(currentBalanceDecimal)) {
                setPending(""); setError(`You only have ${balance.amount} GLQ in your wallet.`);
                return;
            }

            setPending("Pending, check your wallet extension to execute the chain transaction...")
            const result = await contract.addBalance(decimalAmount.toString())
            setPending("Waiting for confirmations...")
            await result.wait()
            setSuccess(result.hash)

            refreshBalanceContract()
        }
        catch (e)
        {
            console.error(e)
            if (e.data?.message) { setPending(""); setError(`Error: ${e.data?.message}`);return; }
            if (e.message) { setPending(""); setError(`Error: ${e.message}`); }
        }
    }

    return (
        <>
            <button className="sbt" ref={finalRef as any} onClick={onOpen}>Deposit <i className="fal fa-long-arrow-up"></i></button>
            <Modal finalFocusRef={finalRef as any} isOpen={isOpen} onClose={onClose} key="test" isCentered>
                <ModalOverlay className="ov" />
                <ModalContent className="mod mod-dep">
                    <header><h2>Cloud Balance Deposit</h2></header>
                    <ModalCloseButton className="clo" />
                    <ModalBody class="fred">
                        <Stack spacing={3} p="4">
                            {error &&
                            <Alert status="error">
                                <i className="fal fa-times-circle"></i> 
                                <p>{error}</p>
                            </Alert>
                            }
                            {!success && pending &&
                            <Alert status="info">
                                <i className="fal fa-info-circle"></i> 
                                <p>{pending}</p>
                            </Alert>
                            }
                            {success &&
                            <Alert status="success" className="alert-m">
                                <i className="fal fa-check-circle"></i> 
                                <p>Deposit successfully completed !
                                <br/><small>Transaction hash : <a href={`https://etherscan.com/tx/${success}`} target="_blank">{success}</a></small></p>
                            </Alert>
                            }
                            <NumberInput className="fd in"
                                placeholder="GLQ Amount"
                                onChange={(value) => { setAmountDeposit(parse(value)) }}
                                value={format(amountDeposit)}
                                size="lg"
                                defaultValue={0}
                                min={0}
                                focusBorderColor="#3907ff"
                                step={0.1}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper color="#3907ff" />
                                    <NumberDecrementStepper color="#3907ff" />
                                </NumberInputStepper>
                            </NumberInput>
                            <Button onClick={doDeposit} className="bt">Deposit</Button>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}