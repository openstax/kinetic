import { React } from '@common'
import { Logo } from './logo'
import { Link } from 'react-router-dom';

export const NavbarLogoLink = () => {
    return (
        <Link to="/studies">
            <Logo height={45} />
        </Link>
    )
}
