import { cx, React, styled, useState } from '@common';
import { Link, NavLink } from 'react-router-dom';
import { useCurrentUser, useIsMobileDevice } from '@lib';
import { Container, Menu, Group, Text, Flex } from '@mantine/core';
import { colors } from '@theme';
import { BannersBar, Icon, NavbarLogoLink } from '@components';
import { loadAsync } from '../async';

interface TopNavBarProps {
    className?: string;
}

const menuToggleStyles = {
    width: 85,
    height: 28,
    opacity: 0.7,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    userSelect: 'none' as const,
};

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
});

const NavbarStyledLink = styled(NavLink)({
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
            <div style={{ height: '80px', backgroundColor: colors.navy }}>
                <Container style={{ height: '80px' }}>
                    <Group 
                        justify="space-between"
                        align="center"
                        style={{
                            width: '100%',
                            height: '80px',
                        }}
                    >
                        <Group>
                            <NavbarLogoLink /> 
                        </Group>
                        <Group
                            justify="center"
                            align="center"
                            gap="40px"
                            style={{
                                height: '80px',
                                padding: '26px 0px 26px 0px',
                            }}
                        >
                            {!isMobile && !user.isAdministrator && !user.isResearcher && (
                                <>
                                    <Wrapper>
                                        <NavbarStyledLink to="/studies" className={({ isActive }) => isActive ? 'active' : ''}>
                            Dashboard
                                        </NavbarStyledLink>
                                    </Wrapper>
                                    <Wrapper>
                                        <NavbarStyledLink to="/achievements" className={({ isActive }) => isActive ? 'active' : ''}>
                            Achievements
                                        </NavbarStyledLink>
                                    </Wrapper>
                                </>
                            )}
                            <NavMenu />
                        </Group>
                    </Group>
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
        <Flex 
            align="center"
            onClick={() => setOpened(!opened)}
            style={menuToggleStyles}
        >
            <Text
                c="white"
                fz={18}
                fw={700}
                lh="28px"
                ff="system-ui"
                mr={5} 
            >
            Hi, {user.firstName}
            </Text>
            <Icon icon={opened ? 'chevronUp' : 'chevronDown'} />
        </Flex>
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
