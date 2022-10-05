import { cx, React } from '@common'
import { Box } from 'boxible'
import { NavbarLogoLink } from './navbar-logo-link'
import { Link } from 'react-router-dom';
import { Menu } from './menu'
import { BannersBar } from './banners-bar'
import { useCurrentUser, useEnvironment, useIsMobileDevice } from '@lib'

export const TopNavBar: FCWOC<{ className?: string }> = ({ children, className }) => {
    const env = useEnvironment()
    const user = useCurrentUser()
    const isMobile = useIsMobileDevice()

    return (
        <nav className={cx('navbar', 'navbar-light', className)}>
            <div className="navbar-dark bg-dark py-1">
                <div className="container-lg">
                    <Box justify="between" align="center" gap padding={{ vertical: 'default' }}>
                        <NavbarLogoLink />
                        {!isMobile && <BannersBar />}
                        {children}
                        <Box gap="xlarge">
                            {!isMobile && <Link to="/studies" css={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Studies</Link>}
                            <Menu alignEnd >
                                {isMobile && <li><Link className="dropdown-item" to="/studies">Studies</Link></li>}
                                <li><Link className="dropdown-item" to="/account">My account</Link></li>
                                <li><a className="dropdown-item" href={env.logoutURL} onClick={() => user.logout()}>Log out</a></li>
                            </Menu>
                        </Box>
                    </Box>
                </div>
            </div>
            {isMobile && <BannersBar />}
        </nav >
    )
}
