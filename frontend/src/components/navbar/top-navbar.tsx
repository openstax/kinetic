import { cx, React, styled, useState } from '@common'
import { Box } from 'boxible'
import { Link, NavLink } from 'react-router-dom';
import { useCurrentUser, useIsMobileDevice, useUserInfo } from '@lib'
import { Menu } from '@mantine/core';
import { colors } from '@theme';
import { BannersBar, Icon, NavbarLogoLink } from '@components';
import { loadAsync } from '../async';

interface TopNavBarProps {
    className?: string
}

export const StyledLink = styled(NavLink)({
    textDecoration: 'none',
    color: colors.text,
    '&.active': {
        color: colors.blue,
    },
})

const AdminLinks = loadAsync('Admin Links', () => import('./admin-links'))
const AccountLinks = loadAsync('Account Links', () => import('./account-links'))

export const TopNavBar: FCWOC<TopNavBarProps> = ({ children, className }) => {
    const user = useCurrentUser()
    const isMobile = useIsMobileDevice()
    const hideBanner = user.isResearcher || user.isAdministrator

    return (
        <nav className={cx('navbar', 'navbar-light', className)}>
            <div className="navbar-dark bg-dark py-1">
                <div className="container-lg">
                    <Box justify="between" align="center" gap padding={{ vertical: 'default' }}>
                        <NavbarLogoLink />
                        {children}
                        <Box gap="xlarge" align="center">
                            {!isMobile && user.isResearcher && <Link to="/studies" css={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Studies</Link>}
                            {!isMobile && user.isResearcher && <Link to="/analysis" css={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Analysis</Link>}
                            <NavMenu />
                        </Box>
                    </Box>
                </div>
            </div>
            {!hideBanner && <BannersBar />}
        </nav>
    )
}

const NavMenu = () => {
    const [opened, setOpened] = useState(false);
    const { data: userInfo } = useUserInfo()
    const isMobile = useIsMobileDevice()

    const menuToggle = isMobile ? (
        <Icon icon="menu" height={30} color="white" />
    ) : (
        <Box gap alignSelf='center' align='center' css={{
            fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none', color: opened ? 'white' : '#b8bbbf',
        }}>
            <span>Hi {userInfo?.first_name}</span>
            <Icon icon={opened ? 'chevronUp' : 'chevronDown'} />
        </Box>
    )

    return (
        <Menu shadow='md' opened={opened} onChange={setOpened} width={175}>
            <Menu.Target>
                {menuToggle}
            </Menu.Target>

            <Menu.Dropdown>
                {isMobile && <Menu.Item><StyledLink to="/studies">Studies</StyledLink></Menu.Item>}
                <AdminLinks />
                <AccountLinks />
            </Menu.Dropdown>
        </Menu>
    );
}