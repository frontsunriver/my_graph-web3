import React, { Suspense } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react';
import { Header } from '../components/Header/Header';
import { Sidebar } from '../components/Sidebar';
import { Main } from './Main';

import routes from '../routes';
import Page404 from '../pages/404';
import { SuspenseSpinner } from '../components/SuspenseSpinner';

interface LayoutProps {

}

const Layout: React.FC<LayoutProps> = ({ }) => {
    return (
        <Flex minH="100vh" h="100vh" bgColor="gray.50">
            <Sidebar />
            <Box as="section" display="flex" flexDirection="column" flex="1" width="full">
                <Header />
                <Main>
                    <Suspense fallback={<SuspenseSpinner />}>
                        <Switch>
                            {routes.map((route, i) => {
                                return route.component ? (
                                    <Route
                                        key={i}
                                        exact={true}
                                        path={`/app${route.path}`}
                                        render={(props) => <route.component {...props} />}
                                    />
                                ) : null
                            })}
                            <Redirect exact from="/" to="/app/home" />
                            <Redirect exact from="/app" to="/app/home" />
                            <Route component={Page404} />
                        </Switch>
                    </Suspense>
                </Main>
            </Box>
        </Flex>
    );
}

export default Layout;