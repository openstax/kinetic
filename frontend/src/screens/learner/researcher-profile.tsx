import { Box, TopNavBar } from '@components';
import { React } from '@common';
import { useUserInfo } from '@lib';

export default function ResearcherProfile() {
    const userInfo = useUserInfo()

    return (
        <Box>
            <TopNavBar />
        </Box>
    )
}
