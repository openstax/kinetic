import { cx, React } from '@common'
import { Box } from 'boxible'
import { NavbarLogoLink } from './navbar-logo-link'
import { Link } from 'react-router-dom';
import { Menu } from './menu'
import { BannersBar } from './banners-bar'
import { useCurrentUser, useEnvironment, useIsMobileDevice } from '@lib'

interface TopNavBarProps {
    className?: string
    controls?: React.ReactElement,
}

export const TopNavBar: FCWOC<TopNavBarProps> = ({ children, controls, className }) => {
    const env = useEnvironment()
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
                            {controls}
                            <Menu alignEnd >
                                {isMobile && <li><Link className="dropdown-item" to="/studies">Studies</Link></li>}

                                {user.isResearcher ?
                                    <li><Link className="dropdown-item" to="/researcher-account">My Account</Link></li> :
                                    <li><Link className="dropdown-item" to="/account">My Account</Link></li>
                                }
                                <li><a className="dropdown-item" href={env.logoutURL} onClick={() => user.logout()}>Log out</a></li>
                            </Menu>
                        </Box>
                    </Box>
                </div>
            </div>
            {!hideBanner && <BannersBar />}
        </nav>
    )
}
