import { React } from '@common'
import { Link } from 'react-router-dom';
import logoURL from '@images/kinetic-logo.png';

export const NavbarLogoLink = () => {
    return (
        <Link to="/studies">
            <img alt='kinetic-logo' height={75} src={logoURL} />
        </Link>
    )
}
