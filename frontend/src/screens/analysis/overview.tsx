import { React, Box, useNavigate } from '@common';
import { ResearcherButton } from '@components';

export const AnalysisOverview = () => {
    const nav = useNavigate()
    return (
        <Box className='analysis-overview' direction='column'>
            <Box align='center' justify='between'>
                <h3>Analysis</h3>

            </Box>
        </Box>
    )
}
