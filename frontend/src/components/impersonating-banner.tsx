import { React, useNavigate } from '@common'
import { Box, Button, Center, Container, Group, Title } from '@mantine/core';
import { useApi, useEnvironment, useFetchEnvironment, useUserInfo } from '@lib';

export const ImpersonatingBanner = () => {
    const api = useApi()
    const nav = useNavigate()
    const { data: userInfo } = useUserInfo()
    const { refetch } = useFetchEnvironment()
    const env = useEnvironment()

    const stopImpersonating = () => {
        api.stopImpersonating().then(() => {
            refetch().then(() => {
                nav('/admin/impersonate-view')
            })
        })
    }

    if (!env?.impersonating) return null

    return (
        <Box bg='osOrange'>
            <Container p='md' size='xl' bg='osOrange'>
                <Center>
                    <Group>
                        <Title order={6}>
                            Currently impersonating as {userInfo?.first_name} {userInfo?.last_name}
                        </Title>
                        <Button onClick={stopImpersonating}>
                            Stop impersonating
                        </Button>
                    </Group>
                </Center>
            </Container>
        </Box>
    )
}
