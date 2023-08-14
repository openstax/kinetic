import { cx, React, styled, useState } from '@common'
import { Box } from 'boxible'
import { NavbarLogoLink } from './navbar-logo-link'
import { Link, NavLink } from 'react-router-dom';
import { BannersBar } from './banners-bar'
import { useCurrentUser, useEnvironment, useIsMobileDevice, useUserInfo } from '@lib'
import { Menu } from '@mantine/core';
import { Icon } from './icon';
import { colors } from '@theme';

interface TopNavBarProps {
    className?: string
}

const StyledLink = styled(NavLink)({
    textDecoration: 'none',
    color: colors.text,
    '&.active': {
        color: colors.blue,
    },
})

const AdminLinks = () => {
    const user = useCurrentUser()
    if (!user.isAdmin) return null

    return (
        <>
            <Menu.Label>Admin</Menu.Label>
            <StyledLink to="/admin/banners">
                <Menu.Item>
                    Banners
                </Menu.Item>
            </StyledLink>
            <StyledLink to="/admin/rewards">
                <Menu.Item>
                    Rewards
                </Menu.Item>
            </StyledLink>
            <StyledLink to="/admin/approve-studies">
                <Menu.Item>
                    Approve Studies
                </Menu.Item>
            </StyledLink>
            <StyledLink to="/admin/workspaces">
                <Menu.Item>
                    Manage workspaces
                </Menu.Item>
            </StyledLink>
            <StyledLink to="/admin/impersonate-view">
                <Menu.Item>
                    Impersonate
                </Menu.Item>
            </StyledLink>
        </>
    )
}

const AccountLinks = () => {
    const env = useEnvironment()

    const user = useCurrentUser()
    if (user.isAdmin || user.isResearcher) {
        return (
            <>
                <Menu.Label>Account</Menu.Label>
                <StyledLink to="/researcher-account">
                    <Menu.Item>
                        My Account
                    </Menu.Item>
                </StyledLink>
                <StyledLink to={env.logoutURL} onClick={() => user.logout()}>
                    <Menu.Item>
                        Log out
                    </Menu.Item>
                </StyledLink>
            </>
        )
    }

    return (
        <>
            <Menu.Label>Account</Menu.Label>
            <StyledLink to="/account">
                <Menu.Item>
                    My Account
                </Menu.Item>
            </StyledLink>
            <StyledLink to={env.logoutURL} onClick={() => user.logout()}>
                <Menu.Item>
                    Log out
                </Menu.Item>
            </StyledLink>
        </>
    )
}

export const TopNavBar: FCWOC<TopNavBarProps> = ({ children, className }) => {
    const user = useCurrentUser()
    const isMobile = useIsMobileDevice()
    const hideBanner = user.isResearcher || user.isAdmin

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
