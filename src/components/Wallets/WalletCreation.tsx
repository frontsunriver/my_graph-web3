import React, { useState } from "react";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, FormControl, FormLabel, Input } from "@chakra-ui/react";
import WalletService from "../../services/walletService";

interface WalletCreationProps {
    setError: any
    setSuccess: any
}

export const WalletCreation: React.FC<WalletCreationProps> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [walletName, setWalletName] = useState("");
    const handleChange = (event: any) => setWalletName(event.target.value)

    const createWallet = async () => {
        props.setSuccess("")
        props.setError("")
        try {
            const result: String | Error = await WalletService.createWallet({
                name: walletName,
            })

            if (result instanceof String) {
                props.setSuccess(result)
                onClose();
            } else {
                props.setError(result)
                onClose();
            }
        }
        catch (e) {
            console.error(e)
            props.setError(`An error occured while creating your wallet: ${e}`)
            onClose();
        }
    }

    return (
        <>
            <Button className="bt" onClick={onOpen}>
                Create Wallet <i className="fal fa-plus"></i>
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg="linear-gradient(to bottom, #1d1938, #15122b)" rounded="xl" size="xl">
                    <ModalHeader color="">Create Wallet :</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Wallet Name :</FormLabel>
                            <Input variant="unstyled" bgColor="#090812" h="1.5rem" py="0.5rem" px="1rem" rounded="xl" type="text" value={walletName} onChange={handleChange} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button className="bt" mr={3} onClick={createWallet}>
                            Create
                        </Button>
                        <Button variant="blackAlpha" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
