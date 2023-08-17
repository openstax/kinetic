import { logoutURL, useCurrentUser, useEnvironment, useFetchEnvironment } from '@lib';
import { Menu } from '@mantine/core';
import { logout } from '@models';
import { React } from '@common';
import { StyledLink } from '@components';

export default function AccountLinks() {
    const user = useCurrentUser()
    const env = useEnvironment()
    const { refetch } = useFetchEnvironment()
    const isAdminOrResearcher = user.isAdministrator || user.isResearcher

    return (
        <>
            <Menu.Label>Account</Menu.Label>
            <StyledLink to={isAdminOrResearcher ? '/researcher-account' : '/account'}>
                <Menu.Item>
                    My Account
                </Menu.Item>
            </StyledLink>
            {!env.isImpersonating &&
                <StyledLink to={logoutURL()} onClick={() => {
                    logout().then(() => refetch())
                }}>
                    <Menu.Item>
                        Log out
                    </Menu.Item>
                </StyledLink>
            }
        </>
    )
}
