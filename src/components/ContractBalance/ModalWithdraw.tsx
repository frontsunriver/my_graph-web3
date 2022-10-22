import React, { useState, useEffect } from 'react'
import { Button, Icon, Text, Alert, AlertDescription, AlertIcon, AlertTitle, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, useDisclosure } from '@chakra-ui/react';
import { FiArrowDownLeft } from 'react-icons/fi';
import { useActiveWeb3React } from '../../hooks';
import WalletService from '../../services/walletService';
import { ResponseSuccess } from '../../providers/responses/success';
import { useWalletContract } from '../../hooks/useWalletContract';

interface ModalWithdrawProps {

}

export const ModalWithdraw: React.FC<ModalWithdrawProps> = ({ }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const finalRef = React.useRef()
    const { account } = useActiveWeb3React()
    const [dueBalance, setDueBalance] = useState(0)
    const [amountWithdraw, setAmountWithdraw] = useState("0.0");
    const [error, setError] = useState("");
    const [pending, setPending] = useState("");
    const [success, setSuccess] = useState("");

    const {refreshBalanceContract} =  useWalletContract();

    const format = (val: string) => val + ` GLQ`;
    const parse = (val: string) => val.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1');

    useEffect(() => {
        const getCloudBalance = async () => {
            try {
                const result = await WalletService.getBalance(account ?? "")
                if (result?.due_balance) {
                    setDueBalance(result.due_balance)
                }
            } catch (e) {
                console.error(e)
            }
        }
        getCloudBalance()
    }, [account])

    async function doWithdraw()
    {
        const asNumber: number = parseFloat(amountWithdraw)
        if (asNumber <= 0) {
            setError(`Invalid amount to withdraw from the balance contract: ${asNumber} GLQ`)
            return 
        }

        setPending("Pending, waiting for server response...")
        const result: ResponseSuccess | String = await WalletService.withdraw(asNumber)
        if (result instanceof String) {
            setPending(""); setError(result.toString());
            return;
        }
        if (result.success) {
            setPending("")
            setError("")
            setSuccess(result.hash)
        }

        setTimeout(() => {
            refreshBalanceContract()
        }, 1000)
    }

    return (
        <>
            <button className="sbt" ref={finalRef as any} onClick={onOpen}>Withdraw <i className="fal fa-long-arrow-down"></i></button>
            <Modal finalFocusRef={finalRef as any} isOpen={isOpen} onClose={onClose} key="test" isCentered>
                <ModalOverlay className="ov" />
                <ModalContent className="mod mod-dep">
                    <header><h2>Cloud Balance Withdraw</h2></header>
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
                            <Alert status="success">
                                <i className="fal fa-check-circle"></i>
                                <p>Withdraw successfully completed !</p>
                                <p><small>Transaction hash : <a href={`https://etherscan.com/tx/${success}`} target="_blank">{success}</a></small></p>
                            </Alert>
                            }
                            <Alert status="info" className="alert-m">
                                <i className="fal fa-info-circle"></i>
                                <p>You currently have <b>{dueBalance} GLQ</b> of execution cost from executed graphs to burn.</p>
                            </Alert>
                            <NumberInput className="fd in"
                                placeholder="GLQ Amount"
                                onChange={(value) => { setAmountWithdraw(parse(value)) }}
                                value={format(amountWithdraw)}
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
                            <Button onClick={doWithdraw} className="bt">Withdraw</Button>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}