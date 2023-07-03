import { Box, React } from '@common'
import { LoadingAnimation, Page } from '@components'
import { Route, Routes } from 'react-router-dom'
import { EditAnalysis } from './analysis/edit'
import { colors } from '@theme';
import { AnalysisOverview } from './analysis/overview';
import { AnalysisDashboard } from './analysis/dashboard';
import { useFetchAnalyses, useFetchStudies } from '@models'

const AnalysisRoutes = () => {
    // TODO Get shared & available studies (backend?)
    const { studies } = useFetchStudies()
    const { data: analyses, isLoading: isLoadingAnalyses } = useFetchAnalyses()

    if (isLoadingAnalyses) return <LoadingAnimation />

    return (
        <Page className='analysis' backgroundColor={colors.white} hideFooter>
            <Box>
                <Routes>
                    <Route path="edit/:analysisId" element={<EditAnalysis analyses={analyses || []} studies={studies} />} />
                    <Route path="overview/:analysisId" element={<AnalysisOverview />} />
                    <Route path="*" element={<AnalysisDashboard analyses={analyses || []} />} />
                </Routes>
            </Box>
        </Page>
    )
}

export default AnalysisRoutes
