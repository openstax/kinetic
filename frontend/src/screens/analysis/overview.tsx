import { Analysis } from '@api';
import { Box, React, useParams } from '@common';
import { useApi } from '@lib';
import { useFetchAnalysis } from '@models';
import { LoadingAnimation } from '@components';

export const AnalysisOverview: FC<{analyses: Analysis[]}> = ({ analyses }) => {
    const { analysisId } = useParams<string>();
    const { data: analysis, isLoading } = useFetchAnalysis(Number(analysisId))
    if (isLoading) return <LoadingAnimation />

    return (
        <Box className='analysis-overview' direction='column'>
            <Box align='center' justify='between'>
                <h3>{analysis?.title} Overview</h3>
            </Box>
        </Box>
    )
}
