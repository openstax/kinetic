import { React, useEffect } from '@common'
import { Route, Routes, useLocation } from 'react-router-dom'
import { PageNotFound } from '@components'
import { loadAsync } from './components/async'
import { useCurrentUser } from '@lib'
import { analytics } from './lib/analytics'
import { ImpersonatingBanner } from './components/impersonating-banner';

const Home = loadAsync('Homepage', () => import('./screens/homepage'))
const Dev = loadAsync('Dev', () => import('./screens/dev'))
const StudyLanding = loadAsync('Study Landing Page', () => import('./screens/study-landing'))
const ResearcherStudies = loadAsync('Researcher Studies', () => import('./screens/researcher/studies/dashboard/researcher-studies'))
const LearnerDashboard = loadAsync('LearnerDashboard', () => import('./screens/learner'))
const AdminHomepage = loadAsync('Admin', () => import('./screens/admin-home'))
const AccountDetails = loadAsync('Account', () => import('./screens/account-details'))
const AnalysisHomepage = loadAsync('Analysis', () => import('./screens/analysis'))
const ResearcherAccountPage = loadAsync('Researcher Account Page', () => import('./screens/researcher/account/researcher-account-page'))
const EditStudy = loadAsync('Edit Study Page', () => import('./screens/researcher/studies/create/edit-study'))
const ResearcherStudyLanding = loadAsync('New Study Landing Page', () => import('./screens/researcher/studies/create/researcher-study-landing'))
const StudyOverview = loadAsync('Study Overview', () => import('./screens/researcher/studies/overview/study-overview'))

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
            <ImpersonatingBanner />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dev/*" element={<Dev />} />
                <Route path="/study/land/:studyId" element={<StudyLanding />} />
                <Route path="/study/create" element={<ResearcherStudyLanding />} />
                <Route path="/study/overview/:id" element={<StudyOverview />} />
                <Route path="/study/edit/:id" element={<EditStudy />} />
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
