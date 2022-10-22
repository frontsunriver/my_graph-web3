import React from 'react'
import { useWeb3React } from "@web3-react/core";
import { Alert, Box } from '@chakra-ui/react';

interface BuyGlqProps {

}

const BuyGlq: React.FC<BuyGlqProps> = ({ }) => {

    const { account } = useWeb3React();

    const apiKey = process.env.REACT_APP_TRANSAK_API_KEY

    return (
        <Box maxW={{ sm: 'xl' }} mx={{ sm: 'auto' }} w={{ sm: 'full' }}>
            <h1 className="tc">Buy GLQ with FIAT</h1>
            <Box className="priv">
                <Alert status="warning">
                    <i className="fal fa-info-circle"></i>
                    <p>You can buy GLQ token with fiat from the secure gateway crypto provider <a href="https://transak.com" target="_blank" rel="noreferrer">Transak.com,</a> with only a 1% fee from your bank withdrawal or card payment.</p>
                </Alert>
                <iframe
                    title="Buy GLQ with FIAT - Transak"
                    id="transakOnOffRampWidget"
                    src={
                        "https://global.transak.com?apiKey=" + apiKey +
                        "&amp;cryptoCurrencyCode=GLQ&defaultCryptoCurrency=GLQ&cryptoCurrencyList=GLQ&hideMenu=true&themeColor=2334ff&walletAddress=" + account}
                    style={{ width: 520, height: 580, borderRadius: 16, overflow: "hidden" }} scrolling="no"></iframe>
            </Box>
        </Box>
    );
}

export default BuyGlq;