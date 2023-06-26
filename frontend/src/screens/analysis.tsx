import { Box, React, useEffect, useState } from '@common'
import { useApi } from '@lib'
import { LoadingAnimation, Page, TopNavBar } from '@components'
import { Link, Route, Routes } from 'react-router-dom'
import { Analysis } from '@api'
import { ListAnalysis } from './analysis/listing'
import { EditAnalysis } from './analysis/edit'
import { useCallback } from 'react'
import { colors } from '@theme';

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
        <Page className='analysis' backgroundColor={colors.white} hideFooter>
            <Box>
                {/*<ListAnalysis listing={analysis} />*/}
                <Routes>
                    <Route path="edit/:analysisId" element={<EditAnalysis listing={analysis} onEditSuccess={fetch} />} />
                    <Route path="*" element={<AddAnalysis />} />
                </Routes>
            </Box>
        </Page>
    )

    // return (
    //     <div>
    //         <TopNavBar />
    //         <Box className="analysis">
    //             <ListAnalysis listing={analysis} />
    //             <Routes>
    //                 <Route path="edit/:analysisId" element={<EditAnalysis listing={analysis} onEditSuccess={fetch} />} />
    //                 <Route path="*" element={<AddAnalysis />} />
    //             </Routes>
    //         </Box>
    //     </div>
    // )
}

export default AnalysisDashboard
