import { cx, React, styled, useState } from '@common'
import { Box } from 'boxible'
import { Link, NavLink } from 'react-router-dom';
import { useCurrentUser, useIsMobileDevice } from '@lib'
import { Container, Menu } from '@mantine/core';
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
    const hideBanner = user.isResearcher

    return (
        <nav className={cx('navbar', 'navbar-light', className)}>
            <div className="navbar-dark bg-dark py-1">
                <Container>
                    <Box justify="between" align="center" gap padding={{ vertical: 'default' }}>
                        <NavbarLogoLink />
                        {children}
                        <Box gap="xlarge" align="center">
                            <DesktopResearcherLinks />
                            <NavMenu />
                        </Box>
                    </Box>
                </Container>
            </div>
            {!hideBanner && <BannersBar />}
        </nav>
    )
}

const DesktopResearcherLinks = () => {
    const user = useCurrentUser()
    const isMobile = useIsMobileDevice()
    if (isMobile || !user.isResearcher) return null

    return (
        <>
            <Link to="/studies" css={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                Studies
            </Link>

            {/* TODO Put this back in one day when enclaves are ready */}
            {/*<Link to="/analysis" css={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>*/}
            {/*    Analysis*/}
            {/*</Link>*/}
        </>
    )
}

const NavMenu = () => {
    const [opened, setOpened] = useState(false);
    const user = useCurrentUser()
    const isMobile = useIsMobileDevice()

    const menuToggle = isMobile ? (
        <Icon icon="menu" height={30} color="white" />
    ) : (
        <Box gap alignSelf='center' align='center' css={{
            fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none', color: colors.white,
        }}>
            <span>Hi {user.firstName}</span>
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
                {user.isAdministrator && <AdminLinks />}
                <AccountLinks />
            </Menu.Dropdown>
        </Menu>
    );
}
