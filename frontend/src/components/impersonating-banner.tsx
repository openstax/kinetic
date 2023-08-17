import { React } from '@common'
import { Box, Button, Center, Container, Group, Title } from '@mantine/core';
import { ENV, useEnvironment, useUserInfo } from '@lib';

export const ImpersonatingBanner = () => {
    const { data: userInfo } = useUserInfo()
    const env = useEnvironment()

    if (!env.isImpersonating) return null

    return (
        <Box bg='osOrange'>
            <Container p='md' size='xl' bg='osOrange'>
                <Center>
                    <Group>
                        <Title order={6}>
                            Currently impersonating as {userInfo?.first_name} {userInfo?.last_name}
                        </Title>
                        <Button component='a' href={`${ENV.API_ADDRESS}/api/v1/admin/impersonate/stop`}>
                            Stop impersonating
                        </Button>
                    </Group>
                </Center>
            </Container>
        </Box>
    )
}
