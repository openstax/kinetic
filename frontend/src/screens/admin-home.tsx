import { React } from '@common'
import { useCurrentUser } from '@lib'
import { Route, Routes, NavLink, Navigate } from 'react-router-dom'
import {
    TopNavBar,
} from '@components'
import { Grid } from './admin/grid'
import { AdminBanners } from './admin/banners'
import { AdminRewards } from './admin/rewards'
import { ApproveStudies } from './admin/approve-studies'
import { AdminWorkspaces } from './admin/workspaces'


export default function AdminHome() {
    const user = useCurrentUser()
    if (!user.isAdmin) { return <Navigate to="/studies" /> }

    return (
        <Grid className="admin">
            <TopNavBar css={{ gridArea: 'header' }}>
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
                            Approve Studies
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" aria-current="page" to="/admin/workspaces">
                            Manage workspaces
                        </NavLink>
                    </li>
                </ul>
            </TopNavBar>
            <Routes>
                <Route path="/" element={<Navigate to="/admin/banners/" />} />
                <Route path="/banners/" element={<AdminBanners />} />
                <Route path="/approve-studies/" element={<ApproveStudies />} />
                <Route path="/rewards/" element={<AdminRewards />} />
                <Route path="/workspaces/:studyId" element={<AdminWorkspaces />} />
            </Routes>

        </Grid>
    )
}
