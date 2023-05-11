import { Box, React, useEffect, useNavigate, useParams, useState } from '@common';
import { useApi } from '@lib';
import { Study } from '@api';
import { TopNavBar } from '@components';

export const ResearcherStudyOverview: FC<{}> = ({}) => {
    const api = useApi()
    const nav = useNavigate()
    const id = useParams<{ id: string }>().id
    const [study, setStudy] = useState<Study>()

    if (!id) {
        return nav('/studies')
    }

    useEffect(() => {
        api.getStudy({ id: +id }).then(study => setStudy(study))
    }, [id])

    return (
        <Box direction='column'>
            <TopNavBar hideBanner />
        </Box>
    )
}
