import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { SUPPORTED_WALLETS } from '../../constants/index'
import { injected } from '../../connectors/index'
import Option from './Option'
import { Alert, AlertIcon, Button, Spacer } from '@chakra-ui/react'

export default function PendingView({
    connector,
    error = false,
    setPendingError,
    tryActivation
}: any) {
    const isMetamask = (window as any)?.ethereum?.isMetaMask

    return (
        <>
                {error ? (
                    <Alert variant="left-accent" status="error" mb={3} py={2} borderRadius="md">
                        <AlertIcon />
                            Error connecting.
                        <Spacer />
                        <Button
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => {
                                setPendingError(false)
                                connector && tryActivation(connector)
                            }}>
                            Try Again
                            </Button>
                    </Alert>
                ) : (
                <Alert variant="left-accent" status="warning" mb={3} py={2} borderRadius="md">
                    <AlertIcon />
                    Initializing...
                    </Alert>
                    )}
            {
                Object.keys(SUPPORTED_WALLETS).map(key => {
                    const option = (SUPPORTED_WALLETS as any)[key]
                    if (option.connector === connector) {
                        if (option.connector === injected) {
                            if (isMetamask && option.name !== 'MetaMask') {
                                return null
                            }
                            if (!isMetamask && option.name === 'MetaMask') {
                                return null
                            }
                        }
                        return (
                            <Option
                                id={`connect-${key}`}
                                key={key}
                                clickable={false}
                                header={option.name}
                                subheader={option.description}
                                icon={option.iconName} />
                        )
                    }
                    return null
                })
            }
        </>
    )
}
