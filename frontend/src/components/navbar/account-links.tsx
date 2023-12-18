import { useLogoutURL, useCurrentUser, useEnvironment, useFetchEnvironment } from '@lib';
import { Menu } from '@mantine/core';
import { logout } from '@models';
import { React } from '@common';
import { StyledLink } from '@components';
import { ManageCookiesLink } from '../manage-cookies';

export default function AccountLinks() {
    const user = useCurrentUser()
    const env = useEnvironment()
    const { refetch } = useFetchEnvironment()
    const logoutURL = useLogoutURL()

    return (
        <>
            <Menu.Label>Account</Menu.Label>
            <StyledLink to={user.isResearcher ? '/researcher-account' : '/account'}>
                <Menu.Item>
                    My Account
                </Menu.Item>
            </StyledLink>
            <StyledLink to='#'>
                <Menu.Item>
                    <ManageCookiesLink />
                </Menu.Item>
            </StyledLink>
            {!env.isImpersonating &&
                <StyledLink to={logoutURL} onClick={() => {
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
