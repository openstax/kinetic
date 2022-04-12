import { React } from '@common'
import { useEnvironment } from '@lib'
import { Route, Routes, NavLink } from 'react-router-dom'
import {
    Box, BannersBar, Logo,
} from '@components'
import { Navigate } from 'react-router-dom'
import { AdminBanners } from './admin/banners'
import { AdminRewards } from './admin/rewards'

export default function AdminHome() {
    const env = useEnvironment()

    return (
        <div className="studies">
            <nav className="navbar navbar-light">
                <div className="navbar-dark bg-dark">
                    <div className="container">
                        <Box justify="between">
                            <a href={env?.config.homepageUrl} className="py-1">
                                <Logo height={45} />
                            </a>
                            <ul className="nav nav-tabs align-self-end">
                                <li className="nav-item">
                                    <NavLink className="nav-link" aria-current="page" to="/admin/banners">
                                        Banners
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" aria-current="page" to="/admin/rewards">
                                        Rewards
                                    </NavLink>
                                </li>
                            </ul>
                        </Box>
                    </div>
                </div>
                <BannersBar />
            </nav>
            <div className="container studies my-8">
                <Routes>
                    <Route path="/" element={<Navigate to="/admin/banners/" />} />
                    <Route path="/banners/" element={<AdminBanners />} />
                    <Route path="/rewards/" element={<AdminRewards />} />
                </Routes>
            </div>
        </div>
    )
}
