import { Box, Footer, TopNavBar } from '@components';
import { React, styled } from '@common';
import { useCurrentUser, useUserInfo } from '@lib';
import { colors } from '../../theme';

export default function ResearcherProfile() {
    const user = useCurrentUser()
    const userInfo = useUserInfo()
    console.log(user, userInfo);

    return (
        <PageWrapper>
            <TopNavBar />

            <Box direction='column' className='container-lg py-5'>
                <h3>My Account</h3>
                <ProfileSection>A</ProfileSection>
                <ProfileSection>B</ProfileSection>
                <ProfileSection>C</ProfileSection>
            </Box>

            <Footer />
        </PageWrapper>
    )
}

const PageWrapper = styled.div({
    backgroundColor: colors.pageBackground,
})

const ProfileSection = styled(Box)({
    flex: 6,
    backgroundColor: colors.white,
    marginTop: 20,
    marginBottom: 10,
    padding: 30,
})

const Resources = styled(Box)({
    flex: 1,
})
