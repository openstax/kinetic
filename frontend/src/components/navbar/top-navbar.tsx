import { cx, React, styled, useState } from '@common';
import { Link, NavLink } from 'react-router-dom';
import { useCurrentUser, useIsMobileDevice } from '@lib';
import { Container, Menu, Group, Text, Flex } from '@mantine/core';
import { colors } from '@theme';
import { BannersBar, Icon, NavbarLogoLink } from '@components';
import { loadAsync } from '../async';

interface TopNavBarProps {
    className?: string
}

const menuToggleStyles = {
    width: 150,
    height: 50,
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
        bottom: '-6px',
        left: 0,
        width: '100%',
        height: '3px',
        backgroundColor: '#0EE094',
    },
    '&:hover::after': {
        content: '""',
        position: 'absolute',
        bottom: '-6x',
        left: 0,
        width: '100%',
        height: '3px',
        backgroundColor: '#0ee094',
    },
});

const AdminLinks = loadAsync('Admin Links', () => import('./admin-links'));
const AccountLinks = loadAsync('Account Links', () => import('./account-links'));
export const TopNavBar: React.FC<TopNavBarProps> = ({ className }) => {
    const user = useCurrentUser();
    const hideBanner = user.isResearcher;
    const isMobile = useIsMobileDevice();

    return (
        <nav
            className={cx('navbar', 'navbar-light', className)}
            style={{
                backgroundColor: colors.navy,
                color: 'white',
                height: '80px',
            }}
        >
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
                            <NavbarStyledLink to="/studies">
                                <Flex align="center" gap="5px">
                                    All Studies
                                </Flex>
                            </NavbarStyledLink>
                            {!isMobile &&
                                !user.isAdministrator &&
                                !user.isResearcher && (
                                <Wrapper> 
                                    <NavbarStyledLink to="/achievements" className={({ isActive }) => isActive ? 'active' : ''}>
                                        <Flex align="center" gap="5px">
                                                Achievements
                                        </Flex>
                                    </NavbarStyledLink>
                                </Wrapper>
                            )}

                            <DesktopResearcherLinks />
                            <NavMenu />
                        </Group>
                    </Group>
                </Container>
            </div>
            {!hideBanner && <BannersBar />}
        </nav>
    );
};

const DesktopResearcherLinks = () => {
    const user = useCurrentUser();
    const isMobile = useIsMobileDevice();
    if (isMobile || !user.isResearcher) return null;

    return (
        <>
            {/* TODO Put this back in one day when enclaves are ready */}
            {/*<Link to="/analysis" css={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>*/}
            {/*    Analysis*/}
            {/*</Link>*/}
        </>
    );
};

const NavMenu: React.FC = () => {
    const [opened, setOpened] = useState(false);
    const user = useCurrentUser()
    const isMobile = useIsMobileDevice()

    const menuToggle = isMobile ? (
        <Icon icon="menu" height={24} width={24} color="white" />
    ) : (
        <Flex
            align="center"
            onClick={() => setOpened(!opened)}
            style={menuToggleStyles}
        >
            <Text c="white" fz={18} fw={700} lh="28px" ff="system-ui" mr={5}>
                Hi, {user.firstName}
            </Text>
            <Icon
                width={24}
                height={24}
                icon={opened ? 'chevronUp' : 'chevronDown'}
            />
        </Flex>
    );

    return (
        <Menu shadow="md" opened={opened} onChange={setOpened} width={175}>
            <Menu.Target>{menuToggle}</Menu.Target>

            <Menu.Dropdown>
                {isMobile && (
                    <Menu.Item>
                        <Link to="/studies">Studies</Link>
                    </Menu.Item>
                )}
                {user.isAdministrator && <AdminLinks />}
                <AccountLinks />
            </Menu.Dropdown>
        </Menu>
    );
}
