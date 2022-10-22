import React, { useState } from "react";
import {
    Alert,
    Button,
    chakra,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Spinner,
    useDisclosure,
} from "@chakra-ui/react";
import { useStakingContract } from "../../hooks/useContract";

interface StakingModalWithdrawProps {
    withdrawAmount: any;
    tx: number;
    setTx: any;
    claimable: any;
}

export const StakingModalWithdraw: React.FC<StakingModalWithdrawProps> = (props: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [error, setError] = useState("");
    const [pending, setPending] = useState("");
    const [success, setSuccess] = useState("");
    const [disabled, setDisabled] = useState(false);
    const stakingContract = useStakingContract(process.env.REACT_APP_STAKING_CONTRACT);

    async function doWithdraw() {
        try {
            setDisabled(true);
            // if (props.claimable <= 0) {
            //     setError(`You need to have claimable rewards to withdraw your staked GLQ.`);
            //     setDisabled(false);
            //     return;
            // }
            if (props.withdrawAmount <= 0) {
                setError(`Invalid amount to withdraw from the staking contract: ${props.withdrawAmount} GLQ`);
                setDisabled(false);
                return;
            }

            setPending("Pending, waiting for response...");
            if (stakingContract == null) {
                setDisabled(false);
                return;
            }
            const result = await stakingContract.withdrawGlq();
            setPending("Waiting for confirmations...");
            const txReceipt = await result.wait();
            if (result instanceof String) {
                setPending("");
                setError(result.toString());
                setDisabled(false);
                return;
            }
            if (txReceipt.status === 1) {
                setPending("");
                setError("");
                setSuccess(txReceipt.transactionHash);
                props.setTx(props.tx + 1);
                onClose();
            }

            setTimeout(() => {
                props.setTx(props.tx + 1);
            }, 1000);
        } catch (e) {
            if (e.data?.originalError?.message) {
                setPending("");
                setError(`Error: ${e.data?.originalError.message}`);
                return;
            }
            if (e.message) {
                setPending("");
                setError(`Error: ${e.message}`);
            }
            setDisabled(false);
        }
    }

    return (
        <>
            <button style={{ marginTop: 20 }} className="bt" onClick={onOpen}>
                Withdraw
            </button>
            <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside" isCentered>
                <ModalOverlay className="ov" />
                <ModalContent className="mod mod-cre">
                    <ModalHeader mt="0">
                        <chakra.h1 color="#F4F1FF">Withdraw staked GLQ</chakra.h1>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody color="#B6ADD6" my="2rem">
                        {error && (
                            <Alert status="error" className="mod" py="2rem" px="3rem" mx="auto" mb="1rem">
                                <i className="fal fa-times-circle"></i>
                                <p>{error}</p>
                            </Alert>
                        )}
                        {!success && pending && (
                            <Alert status="info" className="mod" py="2rem" px="3rem" mx="auto" mb="1rem">
                                <i className="fal fa-info-circle"></i>
                                <p>{pending}</p>
                                <Spacer />
                                <Spinner thickness="2px" speed="0.65s" emptyColor="#15122b" color="blue.600" size="md" />
                            </Alert>
                        )}
                        {success && (
                            <Alert status="success" className="mod" py="2rem" px="3rem" mx="auto" mb="1rem">
                                <i className="fal fa-check-circle"></i>
                                <p>
                                    Successfully completed !
                                    <br />
                                    <small>
                                        Transaction hash :{" "}
                                        <a href={`https://etherscan.com/tx/${success}`} target="_blank">
                                            {success}
                                        </a>
                                    </small>
                                </p>
                            </Alert>
                        )}
                        Are you sure you want to withdraw all your staked GLQ ?
                    </ModalBody>
                    <ModalFooter className="fot">
                        <Button className="bt" style={{ padding: 15, fontSize: "15px" }} onClick={doWithdraw} isDisabled={disabled}>
                            Yes, I'm sure
                        </Button>
                        <Button colorScheme="base" style={{ padding: 15, fontSize: "15px", fontWeight: 500 }} onClick={onClose}>
                            No, cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
