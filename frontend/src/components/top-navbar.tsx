import { React, useNavigate, useCallback } from '@common'
import { Box } from 'boxible'
import { NavbarLogoLink } from './navbar-logo-link'
import { Menu } from './menu'
import { BannersBar } from './banners-bar'
import { useIsMobileDevice } from '@lib'

export const TopNavBar: React.FC = ({ children }) => {
    const nav = useNavigate()
    const onNavClick = useCallback(
        (ev: React.MouseEvent<HTMLAnchorElement>) => nav(ev.currentTarget.pathname),
        [nav])
    const isMobile = useIsMobileDevice()
    return (
        <nav className="navbar navbar-light">
            <div className="navbar-dark bg-dark py-1">
                <div className="container-lg">
                    <Box justify="between">
                        <NavbarLogoLink />
                        {!isMobile && <BannersBar />}
                        {children}
                        <Menu alignEnd >
                            <li><a className="dropdown-item" href="/studies" onClick={onNavClick}>Studies</a></li>
                            <li><a className="dropdown-item" href="/account" onClick={onNavClick}>My account</a></li>
                            <li><a className="dropdown-item" href="/logout" onClick={onNavClick}>Log out</a></li>
                        </Menu>
                    </Box>
                </div>
            </div>
            {isMobile && <BannersBar />}
        </nav>
    )
}