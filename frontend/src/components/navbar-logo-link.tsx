import { React, useNavigate, useCallback } from '@common'
import { Logo } from './logo'

export const NavbarLogoLink = () => {
    const nav = useNavigate()
    const studiesNav = useCallback((ev: React.MouseEvent<HTMLAnchorElement>) => {
        nav(ev.currentTarget.pathname)
    }, [nav])
    return (
        <a href="/studies" onClick={studiesNav}>
            <Logo height={45} />
        </a>
    )
}
