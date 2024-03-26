import { Box, React } from '@common'
import { LoadingAnimation, Page } from '@components'
import { Route, Routes } from 'react-router-dom'
import { EditAnalysis } from './analysis/edit'
import { colors } from '@theme';
import { AnalysisOverview } from './analysis/overview';
import { AnalysisDashboard } from './analysis/dashboard';
import { useFetchAnalyses, useFetchPublicStudies } from '@models'
import { useUserPreferences } from '@lib';
import { AnalysisTutorial } from './analysis/analysis-tutorial';

const AnalysisRoutes = () => {
    const { data: preferences } = useUserPreferences()
    const { data: studies = [], isLoading: isLoadingStudies } = useFetchPublicStudies()
    const { data: analyses = [], isLoading: isLoadingAnalyses } = useFetchAnalyses()

    if (isLoadingAnalyses || isLoadingStudies) return <LoadingAnimation />

    return (
        <Page className='analysis' backgroundColor={colors.white} hideFooter>
            <AnalysisTutorial show={!preferences?.hasViewedAnalysisTutorial}/>
            <Box>
                <Routes>
                    <Route path="edit/:analysisId" element={<EditAnalysis analyses={analyses} studies={studies} />} />
                    <Route path="overview/:analysisId" element={<AnalysisOverview />} />
                    <Route path="*" element={<AnalysisDashboard analyses={analyses} />} />
                </Routes>
            </Box>
        </Page>
    )
}

export default AnalysisRoutes
