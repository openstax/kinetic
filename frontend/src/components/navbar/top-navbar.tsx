import { cx, React, styled, useState } from '@common';
import { Box } from 'boxible';
import { Link, NavLink } from 'react-router-dom';
import { useCurrentUser, useIsMobileDevice } from '@lib';
import { Container, Menu } from '@mantine/core';
import { colors } from '@theme';
import { BannersBar, Icon, NavbarLogoLink } from '@components';
import { loadAsync } from '../async';

interface TopNavBarProps {
    className?: string;
}

const Wrapper = styled.div({
    position: 'relative',
    display: 'inline-block',
});

export const StyledLink = styled(NavLink)({
    textDecoration: 'none',
    color: 'white',
    fontFamily: 'System-ui',
    fontSize: '18px',
    fontWeight: 700,
    lineHeight: '28px',
    textAlign: 'left',
    position: 'relative',
    '&.active': {
        color: 'white',
    },
    '&.active::after': {
        content: '""',
        position: 'absolute',
        bottom: '-2px',
        left: 0,
        width: '100%',
        height: '4px',
        backgroundColor: '#0EE094',
    },
});

const AdminLinks = loadAsync('Admin Links', () => import('./admin-links'));
const AccountLinks = loadAsync('Account Links', () => import('./account-links'));

export const TopNavBar: React.FC<TopNavBarProps> = ({ className }) => {
    const user = useCurrentUser();
    const hideBanner = user.isResearcher;
    const isMobile = useIsMobileDevice();

    return (
        <nav className={cx('navbar', 'navbar-light', className)} style={{ backgroundColor: colors.navy, color: 'white', height: '80px' }}>
            <div style={{ height: '80px', backgroundColor: colors.nav }}>
                <Container style={{ height: '80px' }}>
                    <Box 
                        justify="space-between"
                        align="center"
                        gap="0px"
                        css={{
                            width: '100%',
                            height: '80px',
                            opacity: 1,
                        }}
                    >
                        {/* Left side content */}
                        <Box gap="medium" align="center">
                            <NavbarLogoLink /> 
                        </Box>

                        {/* Right side content */}
                        <Box
                            justify="center"
                            align="center"
                            gap="40px"
                            css={{
                                height: '80px',
                                padding: '26px 0px 26px 0px',
                                opacity: 1,
                            }}
                        >
                            {!isMobile && !user.isAdministrator && !user.isResearcher && (
                                <>
                                    <Wrapper>
                                        <StyledLink to="/studies" className={({ isActive }) => isActive ? 'active' : ''}>
                                            Dashboard
                                        </StyledLink>
                                    </Wrapper>
                                    <Wrapper>
                                        <StyledLink to="/achievements" className={({ isActive }) => isActive ? 'active' : ''}>
                                            Achievements
                                        </StyledLink>
                                    </Wrapper>
                                </>
                            )}
                            <NavMenu />
                        </Box>
                    </Box>
                </Container>
            </div>
            {!hideBanner && <BannersBar />}
        </nav>
    );
};

const NavMenu: React.FC = () => {
    const [opened, setOpened] = useState(false);
    const user = useCurrentUser();
    const isMobile = useIsMobileDevice();

    const menuToggle = isMobile ? (
        <Icon icon="menu" height={30} color="white" />
    ) : (
        <Box 
            justify="center"
            align="center"
            gap="0px"
            css={{
                width: '85px',
                height: '28px',
                opacity: 0.7,
                fontFamily: 'system-ui',
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: '28px',
                textAlign: 'right',
                cursor: 'pointer', 
                whiteSpace: 'nowrap', 
                userSelect: 'none', 
                color: 'white',
            }}
            onClick={() => setOpened(!opened)}
        >
            <span>Hi, {user.firstName}</span>
            <Icon icon={opened ? 'chevronUp' : 'chevronDown'} />
        </Box>
    );

    return (
        <Menu shadow='md' opened={opened} onChange={setOpened} width={175}>
            <Menu.Target>
                {menuToggle}
            </Menu.Target>

            <Menu.Dropdown>
                {isMobile && <Menu.Item><Link to="/study">Dashboard</Link></Menu.Item>}
                {user.isAdministrator && <AdminLinks />}
                <AccountLinks />
            </Menu.Dropdown>
        </Menu>
    );
};
