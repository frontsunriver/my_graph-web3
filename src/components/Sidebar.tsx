import React from 'react'
import { Box, Icon, Link, Image } from '@chakra-ui/react';
import { NavLink, Route } from 'react-router-dom';
import routes from '../routes/sidebar'
import * as Icons from 'react-icons/hi'
import GLQLogo from "../assets/logo.svg"
import { ContractCard } from './ContractBalance/ContractCard';

interface SidebarProps {

}

const IconSidebar = ({ icon, ...props }: any) => {
    const iconName = (Icons as any)[icon]
    return <Icon as={iconName} {...props} />
}

export const Sidebar: React.FC<SidebarProps> = ({ }) => {
    return (
        <aside id="a">
            <Box as="nav" id="n" h="100vh">
                <Box display="flex" flexDirection="column" h="full">
            <div className="lo">
               <Image src={GLQLogo}/>
            </div>
            <ContractCard />
                    <Box as="ul">
                    {routes.map((route: any, i: number) => (
                        <li key={i}>
                            <Link
                                as={NavLink}
                                exact
                                to={route.path}
                                _activeLink={{className:'active'}}
                            >
                                <Route path={route.path} exact={route.exact}></Route>
                                <IconSidebar icon={route.icon} w={4} h={4} />
                                {route.name}
                            </Link>
                        </li>
                    ))}
                    </Box>
                    <Box as="ul" mt="auto" mb="1rem">
                    <li>
                        <Link href="https://ide.graphlinq.io/" isExternal>
                            <IconSidebar icon="HiOutlineTerminal" w={4} h={4} />
                            IDE
                        </Link>
                    </li>
                    <li>
                        <Link href="https://analytics.graphlinq.io/" isExternal>
                            <IconSidebar icon="HiOutlineTrendingUp" w={4} h={4} />
                            Analytics
                        </Link>
                    </li>
                    </Box>
                </Box>
            </Box>
        </aside>
    );
}