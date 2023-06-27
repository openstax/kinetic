import { Box, React, useEffect, useState } from '@common'
import { useApi } from '@lib'
import { LoadingAnimation, Page } from '@components'
import { Route, Routes } from 'react-router-dom'
import { Analysis, Study } from '@api'
import { EditAnalysis } from './analysis/edit'
import { useCallback } from 'react'
import { colors } from '@theme';
import dayjs from 'dayjs';

const AnalysisDashboard = () => {
    const api = useApi()
    const [analyses, setAnalyses] = useState<Analysis[] | null>(null)
    const [studies, setStudies] = useState<Study[]>([])

    const fetch = useCallback(() => {
        api.listAnalysis().then((res) => {
            setAnalyses(res.data || [])
        })

        // TODO Get available studies new endpoint
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
    useEffect(fetch, [])

    if (analyses === null) return <LoadingAnimation />

    return (
        <Page className='analysis' backgroundColor={colors.white} hideFooter>
            <Box>
                <Routes>
                    <Route path="edit/:analysisId" element={<EditAnalysis analyses={analyses} studies={studies} onEditSuccess={fetch} />} />
                    {/*<Route path="*" element={<AddAnalysis />} />*/}
                </Routes>
            </Box>
        </Page>
    )
}

export default AnalysisDashboard
