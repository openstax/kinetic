import { React, useEffect } from '@common'
import { Route, Routes, useLocation } from 'react-router-dom'
import { PageNotFound } from '@components'
import { loadAsync } from './components/async'
import { useCurrentUser } from '@lib'
import { analytics } from './lib/analytics'

const Home = loadAsync('Homepage', () => import('./screens/homepage'))
const Dev = loadAsync('Dev', () => import('./screens/dev'))
const StudyLanding = loadAsync('Study Landing Page', () => import('./screens/study-landing'))
const EditStudy = loadAsync('Edit Study Details', () => import('./screens/study-edit'))
const StudyDetails = loadAsync('Study Details', () => import('./screens/study-details'))
const Researcher = loadAsync('Studies', () => import('./screens/researcher-home'))
const Participant = loadAsync('Studies', () => import('./screens/participant-home'))
const AdminHomepage = loadAsync('Admin', () => import('./screens/admin-home'))
const StudiesHomepage = () => {
    const user = useCurrentUser()
    return user.isResearcher ? <Researcher /> : <Participant />
}

export const AppRoutes = () => {
    const user = useCurrentUser()
    const location = useLocation()
    useEffect(() => {
        analytics.page()
    }, [location.pathname])
    return (
        <div className="openstax-kinetic" data-user-id={user.id}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dev/*" element={<Dev />} />
                <Route path="/study/land/:studyId" element={<StudyLanding />} />
                <Route path={'/study/edit/:id'} element={<EditStudy />} />
                <Route path={'/study/details/:id'} element={<StudyDetails />} />
                <Route path="/studies/*" element={<StudiesHomepage />} />
                <Route path="/admin/*" element={<AdminHomepage />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </div>
    )
}
