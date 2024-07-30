import { React } from '@common'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PageNotFound } from '@components'
import { loadAsync } from './components/async'
import { useApi, useCurrentUser } from '@lib'
import { LandStudyAbortedEnum, LandStudyRequest } from '@api';

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
const Achievements = loadAsync('Achievements', () => import('./screens/achievements'))

const StudiesHomepage = () => {
    const user = useCurrentUser()
    return user.isResearcher ? <ResearcherStudies /> : <LearnerDashboard />
}

// const router = createBrowserRouter([
//     {
//         path: '/', element: <Home />,
//         children: [
//             { path: 'dev/user', element: <Dev /> },
//             {
//                 path: 'study/land/:studyId',
//                 element: <StudyLanding />,
//                 loader: async ({ params }) => {
//
//                     console.log(params.studyId)
//                     return true
//                 },
//             },
//             { path: 'study/create', element: <ResearcherStudyLanding /> },
//             { path: 'study/overview/:id', element: <StudyOverview /> },
//             { path: 'study/edit/:id', element: <EditStudy /> },
//             { path: 'account', element: <AccountDetails /> },
//             { path: 'researcher-account', element: <ResearcherAccountPage /> },
//             { path: 'studies/status/:studyStatus', element: <StudiesHomepage /> },
//             { path: 'studies/*', element: <StudiesHomepage /> },
//             { path: 'analysis/*', element: <AnalysisHomepage /> },
//             { path: 'admin/*', element: <AdminHomepage /> },
//             { path: '*', element: <PageNotFound /> },
//         ],
//     },
// ])


export const AppRoutes = () => {
    const user = useCurrentUser()
    const api = useApi()

    const router = createBrowserRouter([
        {
            path: '/', element: <Home />,
            children: [
                { path: 'dev/user', element: <Dev /> },
                {
                    path: 'study/land/:studyId',
                    element: <StudyLanding />,
                    loader: async ({ request, params }) => {
                        const url = new URL(request.url)
                        const consent = url.searchParams.get('consent') != 'false';
                        const abort = url.searchParams.get('abort') == 'true'
                        const md = url.searchParams.get('md') || {}

                        const requestParams: LandStudyRequest = {
                            id: Number(params.studyId),
                            md,
                            consent,
                            aborted: abort ? LandStudyAbortedEnum.Refusedconsent : undefined,
                        }

                        return api.landStudy(requestParams)
                    },
                },
                { path: 'study/create', element: <ResearcherStudyLanding /> },
                { path: 'study/overview/:id', element: <StudyOverview /> },
                { path: 'study/edit/:id', element: <EditStudy /> },
                { path: 'account', element: <AccountDetails /> },
                { path: 'researcher-account', element: <ResearcherAccountPage /> },
                { path: 'studies/status/:studyStatus', element: <StudiesHomepage /> },
                { path: 'studies/*', element: <StudiesHomepage /> },
                { path: 'analysis/*', element: <AnalysisHomepage /> },
                { path: 'admin/*', element: <AdminHomepage /> },
                { path: '*', element: <PageNotFound /> },
                {path: 'achievements', element: <Achievements />},
            ],
        },
    ])

    return (
        <div className="openstax-kinetic" data-user-id={user.userId}>
            <RouterProvider router={router} />
        </div>
    )
}
