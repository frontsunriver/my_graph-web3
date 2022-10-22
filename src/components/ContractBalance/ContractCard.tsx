import { Box, Button, ButtonGroup, Icon, Text } from '@chakra-ui/react';
import { FiArrowDownLeft } from 'react-icons/fi';
import { ModalDeposit } from './ModalDeposit';
import { ModalWithdraw } from './ModalWithdraw';
import React, { useEffect, useState } from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useWalletContract } from "../../hooks/useWalletContract"

interface ContractCardProps {

}

export const ContractCard: React.FC<ContractCardProps> = ({ }) => {

    const { account } = useWeb3React();
    const {balance, refreshBalanceContract} =  useWalletContract();

    useEffect(()  => {
        refreshBalanceContract();
    }, [account])

    return (
        <div className="bal">
            <h2>Cloud Contract Balance</h2>
            <div className="val in"><strong>{balance.amount}</strong> GLQ</div>
            <div className="act">
                <ModalDeposit />
                <ModalWithdraw />
            </div>
        </div>
    );
}