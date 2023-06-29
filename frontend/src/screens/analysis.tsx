import { Box, React, useEffect, useState } from '@common'
import { useApi } from '@lib'
import { LoadingAnimation, Page } from '@components'
import { Route, Routes } from 'react-router-dom'
import { Analysis, Study } from '@api'
import { EditAnalysis } from './analysis/edit'
import { useCallback } from 'react'
import { colors } from '@theme';
import dayjs from 'dayjs';
import { AnalysisOverview } from './analysis/overview';
import { AnalysisDashboard } from './analysis/dashboard';
import { useQuery } from 'react-query';
import { useFetchAnalyses } from '@models'

const AnalysisRoutes = () => {
    const api = useApi()
    // const [analyses, setAnalyses] = useState<Analysis[] | null>(null)
    const [studies, setStudies] = useState<Study[]>([])
    const { data: analyses, isLoading: isLoadingAnalyses } = useFetchAnalyses()

    // console.log(data)
    const fetchAnalyses = useCallback(() => {
        // api.listAnalysis().then((res) => {
        //     setAnalyses(res.data || [])
        // })

        // TODO Get available studies new endpoint or filter clientside?
        api.getStudies().then((studies) => {
            const filtered = (studies.data || []).filter(s => {
                // TODO Logic
                return true
                if (s.shareableAfterMonths == null) {
                    return false
                }
                const closesAt = dayjs(s.closesAt)
                const publicDate = dayjs().subtract(s.shareableAfterMonths || 0, 'months')
                return closesAt.isBefore(publicDate)
            })
            setStudies(filtered)
        })
    },[])
    useEffect(fetchAnalyses, [])

    if (isLoadingAnalyses) return <LoadingAnimation />

    return (
        <Page className='analysis' backgroundColor={colors.white} hideFooter>
            <Box>
                <Routes>
                    <Route path="edit/:analysisId" element={<EditAnalysis analyses={analyses || []} studies={studies} onEditSuccess={fetchAnalyses} />} />
                    <Route path="overview/:analysisId" element={<AnalysisOverview analyses={analyses || []} />} />
                    <Route path="*" element={<AnalysisDashboard analyses={analyses || []} fetchAnalyses={fetchAnalyses}/>} />
                </Routes>
            </Box>
        </Page>
    )
}

export default AnalysisRoutes
