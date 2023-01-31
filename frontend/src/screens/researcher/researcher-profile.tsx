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
            <Content className='container-lg py-5'>
                <h3>My Account</h3>

                <Box>
                    <Box direction='column'>
                        <ProfileSection>AB</ProfileSection>
                        <ProfileSection>B</ProfileSection>
                        <ProfileSection>C</ProfileSection>
                    </Box>
                    <Resources>Test</Resources>
                </Box>
            </Content>

            <Footer className='mt-auto' />
        </PageWrapper>
    )
}

const PageWrapper = styled(Box)({
    backgroundColor: colors.pageBackground,
    flexDirection: 'column',
    height: '100vh',
})

const Content = styled.div({
})

const ProfileSection = styled(Box)({
    backgroundColor: colors.white,
    marginTop: 20,
    marginBottom: 10,
    padding: 30,
})

const Resources = styled(Box)({
    backgroundColor: colors.white,
    marginTop: 20,
    marginBottom: 10,
    padding: 30,
})
