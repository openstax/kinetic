import { React, useEffect } from '@common'
import { Route, Routes, useLocation } from 'react-router-dom'
import { PageNotFound } from '@components'
import { loadAsync } from './components/async'
import { useCurrentUser } from '@lib'
import { analytics } from './lib/analytics'

const Home = loadAsync('Homepage', () => import('./screens/homepage'))
const Dev = loadAsync('Dev', () => import('./screens/dev'))
const StudyLanding = loadAsync('Study Landing Page', () => import('./screens/study-landing'))
const ResearcherStudies = loadAsync('Studies', () => import('./screens/researcher/studies/dashboard/researcher-studies'))
const LearnerDashboard = loadAsync('Studies', () => import('./screens/learner'))
const AdminHomepage = loadAsync('Admin', () => import('./screens/admin-home'))
const AccountDetails = loadAsync('Account', () => import('./screens/account-details'))
const AnalysisHomepage = loadAsync('Analysis', () => import('./screens/analysis'))
const ResearcherAccountPage = loadAsync('Researcher Account Page', () => import('./screens/researcher/account/researcher-account-page'))
const EditStudy = loadAsync('Edit Study Page', () => import('./screens/researcher/studies/create/edit-study'))
const ResearcherStudyLanding = loadAsync('New Study Landing Page', () => import('./screens/researcher/studies/create/researcher-study-landing'))

const StudiesHomepage = () => {
    const user = useCurrentUser()
    return user.isResearcher ? <ResearcherStudies /> : <LearnerDashboard />
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
                {/*<Route path="/study/edit/:id" element={<EditStudy />} />*/}
                <Route path="/study/create" element={<ResearcherStudyLanding />} />
                <Route path="/study/edit/:id" element={<EditStudy />} />
                <Route path="/study/edit/:id/about-researcher" element={<EditStudy />} />
                <Route path="/study/edit/:id/researcher-info" element={<EditStudy />} />
                <Route path="/study/edit/:id/learner-info" element={<EditStudy />} />
                <Route path="/study/edit/:id/sessions" element={<EditStudy />} />
                <Route path="/account" element={<AccountDetails />} />
                <Route path="/researcher-account" element={<ResearcherAccountPage />} />
                <Route path="/studies/*" element={<StudiesHomepage />} />
                <Route path="/analysis/*" element={<AnalysisHomepage />} />
                <Route path="/admin/*" element={<AdminHomepage />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </div>
    )
}
