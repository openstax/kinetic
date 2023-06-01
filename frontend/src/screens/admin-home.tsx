import { React } from '@common'
import { useCurrentUser } from '@lib'
import { Route, Routes, NavLink, Navigate } from 'react-router-dom'
import {
    TopNavBar,
} from '@components'
import { AdminBanners } from './admin/banners'
import { AdminRewards } from './admin/rewards'
import { ApproveStudies } from './admin/approve-studies';

export default function AdminHome() {
    const user = useCurrentUser()
    if (!user.isAdmin) { return <Navigate to="/studies" /> }

    return (
        <div className="admin">
            <TopNavBar>
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
                    <li className="nav-item">
                        <NavLink className="nav-link" aria-current="page" to="/admin/approve-studies">
                            Studies
                        </NavLink>
                    </li>
                </ul>
            </TopNavBar>
            <div className="container studies my-8">
                <Routes>
                    <Route path="/" element={<Navigate to="/admin/banners/" />} />
                    <Route path="/banners/" element={<AdminBanners />} />
                    <Route path="/approve-studies/" element={<ApproveStudies />} />
                    <Route path="/rewards/" element={<AdminRewards />} />
                </Routes>
            </div>
        </div>
    )
}
