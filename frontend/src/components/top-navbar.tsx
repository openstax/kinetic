import { React, useNavigate, useCallback, cx } from '@common'
import { Box } from 'boxible'
import { NavbarLogoLink } from './navbar-logo-link'
import { Menu } from './menu'
import { BannersBar } from './banners-bar'
import { useEnvironment, useIsMobileDevice } from '@lib'

export const TopNavBar: FCWOC<{ className?: string }> = ({ children, className }) => {
    const nav = useNavigate()
    const env = useEnvironment()
    const onNavClick = useCallback(
        (ev: React.MouseEvent<HTMLAnchorElement>) => nav(ev.currentTarget.pathname),
        [nav])
    const isMobile = useIsMobileDevice()
    return (
        <nav className={cx('navbar', 'navbar-light', className)}>
            < div className="navbar-dark bg-dark py-1" >
                <div className="container-lg">
                    <Box justify="between" align="center" gap pad={{ vertical: 'default' }}>
                        <NavbarLogoLink />
                        {!isMobile && <BannersBar />}
                        {children}
                        <Box gap="xlarge">
                            {!isMobile && <a href="/studies" css={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }} onClick={onNavClick}>Studies</a>}
                            <Menu alignEnd >
                                {isMobile && <li><a className="dropdown-item" href="/studies">Studies</a></li>}
                                <li><a className="dropdown-item" href="/account">My account</a></li>
                                <li><a className="dropdown-item" href={env.logoutURL}>Log out</a></li>
                            </Menu>
                        </Box>
                    </Box>
                </div>
            </div >
            {isMobile && <BannersBar />}
        </nav >
    )
}
