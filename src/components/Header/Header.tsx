import React, { useEffect, useState } from "react";
import { Avatar, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Link, Button, keyframes, chakra } from "@chakra-ui/react";

import { WalletConnectIcon, CoinbaseWalletIcon, FortmaticIcon, PortisIcon } from "../../assets/icons";
import Identicon from "./identicon";

import { fortmatic, injected, portis, walletconnect, walletlink } from "../../connectors";

import { shortenAddress } from "../../utils/index";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FiGithub, FiMessageCircle, FiMessageSquare, FiBookOpen } from "react-icons/fi";
import { NavLink } from "react-router-dom";

interface HeaderProps {}

const pulse = keyframes({
    "0%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(139, 92, 246, 0.7)" },
    "70%": { transform: "scale(1)", boxShadow: "0 0 0 10px rgba(139, 92, 246, 0)" },
    "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(139, 92, 246, 0)" },
});

export const Header: React.FC<HeaderProps> = ({}) => {
    const { account, connector } = useWeb3React();
    let amountBalance = useSelector((state: any) => state.modals.balance.amount);

    function formatCur(num: number, min: number, max: number) {
        const formatConfig = {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: min,
            maximumFractionDigits: max,
            currencyDisplay: "symbol",
        };
        const curFormatter = new Intl.NumberFormat("en-US", formatConfig);

        return curFormatter.format(num);
    }
    const [glqPrice, setGlqPrice] = useState("");
    const refreshGlqPrice = async () => {
        try {
            let response = await fetch("https://api.graphlinq.io/front/token");
            let responseJson = await response.json();
            setGlqPrice(formatCur(responseJson.uni.glqPrice, 0, 5));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        refreshGlqPrice()
    }, []);

    return (
        <header id="h">
            <div className="l">
                <button
                    className="bnv"
                    data-nav=""
                    onClick={() => {
                        document.body.classList.toggle("onav");
                    }}
                >
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <path className="l-1" d="M0,42h62c13,0,6,26-4,16L35,35"></path>
                        <path className="l-2" d="M0,50h70"></path>
                        <path className="l-3" d="M0,58h62c13,0,6-26-4-16L35,65"></path>
                    </svg>
                </button>
                <Link as={NavLink} to="/app/home" className="bt btm">
                    Make a Graph <i className="fal fa-plus-circle"></i>
                </Link>
                <chakra.div ml="1rem" rounded="full" textAlign="center" bgColor="#090812" px="1rem" py=".5rem">
                    <chakra.p fontSize="sm">
                        GLQ : <b>{glqPrice}</b>
                    </chakra.p>
                </chakra.div>
            </div>
            <div className="r">
                {account !== undefined && (
                    <div className="rt">
                        <Button as={NavLink} exact to="staking" className="bt">
                            Stake your GLQ
                            <i className="fal fa-cube"></i>
                        </Button>

                        <Button as={NavLink} exact to="buy-glq" className="bt">
                            Buy GLQ with FIAT
                            <i className="fal fa-shopping-cart"></i>
                        </Button>
                        {/* <Button
                        as={NavLink}
                        exact
                        to="private-sale"
                        className="bt"
                        >
                            Private Sale
                            <i className="fal fa-database"></i>
                        </Button> */}
                        <div className="gl in">{amountBalance} GLQ</div>
                        <div className="ad in">{shortenAddress(account)}</div>
                    </div>
                )}
                <Menu>
                    <MenuButton as={IconButton} aria-label="Links" icon={<Icon as={HiOutlineDotsHorizontal} w={5} h={5} />} className="mn" />
                    <MenuList className="mnv">
                        <MenuItem as={Link} icon={<FiBookOpen />} href="https://docs.graphlinq.io/" isExternal>
                            Documentation
                        </MenuItem>
                        <MenuItem as={Link} icon={<FiMessageCircle />} href="https://discord.gg/k3tqWzub" isExternal>
                            Discord
                        </MenuItem>
                        <MenuItem as={Link} icon={<FiMessageSquare />} href="https://t.me/graphlinq" isExternal>
                            Telegram
                        </MenuItem>
                        <MenuItem as={Link} icon={<FiGithub />} href="https://github.com/GraphLinq" isExternal>
                            Github
                        </MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </header>
    );
};

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: any) {
    if (connector === injected) {
        return <Identicon />;
    }
    if (connector === walletconnect) {
        return <Avatar bgColor="white" as={WalletConnectIcon} size="xs" ml={-2} mr={2} />;
    }
    if (connector === walletlink) {
        return <Avatar bgColor="white" as={CoinbaseWalletIcon} size="xs" ml={-2} mr={2} />;
    }
    if (connector === fortmatic) {
        return <Avatar bgColor="white" as={FortmaticIcon} size="xs" ml={-2} mr={2} />;
    }
    if (connector === portis) {
        return <Avatar bgColor="white" as={PortisIcon} size="xs" ml={-2} mr={2} />;
    }
    return null;
}
