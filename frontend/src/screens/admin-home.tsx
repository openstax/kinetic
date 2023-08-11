import { React } from '@common'
import { useCurrentUser } from '@lib'
import { Navigate, Route, Routes } from 'react-router-dom'
import { TopNavBar } from '@components'
import { Grid } from './admin/grid'
import { AdminBanners } from './admin/banners'
import { AdminRewards } from './admin/rewards'
import { ApproveStudies } from './admin/approve-studies'
import { AdminWorkspaces } from './admin/workspaces'
import { MasqueradeView } from './admin/masquerade-view'

export default function AdminHome() {
    const user = useCurrentUser()
    if (!user.isAdmin) { return <Navigate to="/studies" /> }

    return (
        <Grid className="admin">
            <TopNavBar css={{ gridArea: 'header', gridColumnStart: 'span 2' }} />
            <Routes>
                <Route path="/" element={<Navigate to="/admin/banners/" />} />
                <Route path="/banners/" element={<AdminBanners />} />
                <Route path="/approve-studies/" element={<ApproveStudies />} />
                <Route path="/rewards/" element={<AdminRewards />} />
                <Route path="/workspaces/:studyId?" element={<AdminWorkspaces />} />
                <Route path="/masquerade-view/" element={<MasqueradeView />} />
            </Routes>

        </Grid>
    )
}
