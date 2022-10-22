import React from 'react'
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Image } from '@chakra-ui/react';
import GLQLogo from "../assets/logo.svg"
import WalletManager from "../components/BrowserWallet/WalletManager"

interface AuthProps {

}

const Auth: React.FC<AuthProps> = ({ }) => {
    return (
        <Box id="auth">
            <div className="auth-h">
                <Image src={GLQLogo}/>
            </div>
            <div className="auth-c">
                <div className="top">
                    <h2>Dashboard Access</h2>
                    <p>Connect your wallet to access your dashboard.</p>
                </div>
                <Tabs className="tab">
                    <TabList className="tabt">
                        <Tab><span>Browser Extension</span></Tab>
                        <Tab isDisabled><span>Wallet Direct</span></Tab>
                        <Tab isDisabled><span>Ledger USB</span></Tab>
                    </TabList>
                    <TabPanels className="tabp">
                        <TabPanel>
                            <div className="ls-c">
                                <WalletManager />
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <p>Wallet Direct component</p>
                        </TabPanel>
                        <TabPanel>
                            <p>Ledger USB component</p>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
            <div className="auth-f">
                New to GraphLinq Wallet ?
                <a target="_blank" href="https://docs.graphlinq.io/wallet" rel="noreferrer">Learn more</a>
            </div>
        </Box>
    );
}

export default Auth;