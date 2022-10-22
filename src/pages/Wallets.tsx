import React, { useEffect, useState } from "react";
import { Text, Button, Box, Spacer, Icon, useClipboard, Input, Alert, Link } from "@chakra-ui/react";
import { WalletCreation } from "../components/Wallets/WalletCreation";
import { HiExternalLink, HiOutlineClipboardCopy } from "react-icons/hi";
import WalletService from "../services/walletService";
import { useDispatch, useSelector } from "react-redux";
import { WALLET_UPDATE } from "../redux/actions";
import { SuspenseSpinner } from "../components/SuspenseSpinner";
import { useWeb3React } from "@web3-react/core";
import { ManagedResponse } from "../providers/responses/managed";

interface WalletsProps {}

const Wallets: React.FC<WalletsProps> = ({}) => {
    //const publicKey = "";
    //const { hasCopied, onCopy } = useClipboard(publicKey);

    const [reachable, setReacheable] = useState(true);
    const { account } = useWeb3React();
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { hasCopied, onCopy } = useClipboard(success)

    const walletList: ManagedResponse[] = useSelector((state: any) => state.modals.wallets.list);

    const loaded: boolean = useSelector((state: any) => state.modals.wallets.loaded);

    useEffect(() => {
        const refreshfnc = async () => {
            const wallets: ManagedResponse[] | undefined = await WalletService.listWallets();
            if (wallets === undefined) {
                return setReacheable(false);
            }
            dispatch({
                name: "wallets",
                type: WALLET_UPDATE,
                payload: { wallets, loaded: true },
            });

            setTimeout(refreshfnc, 10000);
        };

        refreshfnc();
    }, [account]);

    return (
        <>
            <h1>
                My Wallets
                <WalletCreation setSuccess={setSuccess} setError={setError} />
            </h1>
            {reachable && !loaded && <SuspenseSpinner />}
            {walletList.length == 0 && loaded && (
                <Alert status="info">
                    <i className="fal fa-exclamation-triangle"></i>
                    <p>You don't have any managed wallet yet.</p>
                </Alert>
            )}
            {error && (
                <Alert status="error" className="mod" py="2rem" px="3rem" mx="auto" my="1rem">
                    <i className="fal fa-times-circle"></i>
                    <p>{error}</p>
                </Alert>
            )}
            {success && (
                <>
                    <Alert status="success" className="mod" py="2rem" px="3rem" mx="auto" my="1rem">
                        <i className="fal fa-check-circle"></i>
                        <p>Wallet created !</p>
                    </Alert>
                    <Alert textAlign="left" status="info" className="mod" py="2rem" px="3rem" mx="auto" my="1rem" flexDir="column" flexWrap="nowrap">
                        <i className="fal fa-info-circle"></i>
                        <Text my="1rem">Please save your private key as it won't be available again and therefore encrypted in our network.</Text>
                        <Box w="full">
                            <Input
                                variant="unstyled"
                                bgColor="#09081280"
                                h="1.5rem"
                                py="0.5rem"
                                px="1rem"
                                rounded="xl"
                                type="text"
                                w="90%"
                                value={success}
                                isReadOnly
                            />
                            <Button onClick={onCopy} ml={2}>
                                {hasCopied ? "Copied" : "Copy"}
                            </Button>
                        </Box>
                    </Alert>
                </>
            )}
            {walletList.length > 0 && (
                <>
                    <Box display="flex" alignItems="center" w="full" px="4" py="6" rounded="lg">
                        <Box display="flex" width="25%" px={2}>
                            Wallet name
                        </Box>
                        <Box display="flex" width={["30%", "55%"]} px={2}>
                            Address
                        </Box>
                        <Spacer />
                        <Box display="flex" width="10%" px={2}>
                            Ether Amount
                        </Box>
                    </Box>
                    {walletList.map((wallet: any, i: number) => {
                        return (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                bg="linear-gradient(to bottom, #1d1938, #15122b)"
                                w="full"
                                px="4"
                                py="6"
                                rounded="lg"
                                mb={4}
                                key={`${wallet.walletId}-${i}`}
                            >
                                <Box display="flex" width="25%" px={2}>
                                    {wallet.name}
                                </Box>
                                <Box display="flex" width={["30%", "55%"]} px={2} alignItems="center">
                                    <Link href={`https://etherscan.io/address/${wallet.publicKey}`} isExternal isTruncated>
                                        {wallet.publicKey}
                                    </Link>
                                    <Icon as={HiExternalLink} mx="4px" />
                                </Box>
                                <Spacer />
                                <Box display="flex" width="10%" px={2}>
                                    {wallet.balance} ETH
                                </Box>
                            </Box>
                        );
                    })}
                </>
            )}
        </>
    );
};

export default Wallets;
