import { React, Box, useEffect, useState } from '@common'
import { useApi } from '@lib'
import { LoadingAnimation, TopNavBar, LinkButton } from '@components'
import { Route, Routes } from 'react-router-dom'
import { Analysis } from '@api'
import { ListAnalysis } from './analysis/listing'
import { EditAnalysis } from './analysis/edit'
import { useCallback } from 'react'
import { Link } from 'react-router-dom'

const AddAnalysis = () => {
    return (
        <div className="p-8">
            <h3>Looks like you have not yet created any analyses</h3>
            <Link to="/analysis/edit/new">Add new</Link>
        </div>
    )
}
const AnalysisDashboard = () => {
    const api = useApi()
    const [analysis, setAnalysis] = useState<Array<Analysis> | null>(null)

    const fetch = useCallback(() => {
        api.listAnalysis().then((res) => {
            setAnalysis(res.data || [])
        })
    },[])
    useEffect(fetch, [])

    if (analysis === null) return <LoadingAnimation />

    return (
        <div>
            <TopNavBar controls={<LinkButton primary to="/analysis/edit/new">Add Analysis</LinkButton>} />

            <Box className="analysis">
                <ListAnalysis listing={analysis} />
                <Routes>
                    <Route path="edit/:analysisId" element={<EditAnalysis listing={analysis} onEditSuccess={fetch} />} />
                    <Route path="*" element={<AddAnalysis />} />
                </Routes>
            </Box>
        </div>
    )
}

export default AnalysisDashboard
