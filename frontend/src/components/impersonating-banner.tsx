import { React } from '@common'
import { Box, Button, Center, Container, Group, Title } from '@mantine/core';
import { ENV, useCurrentUser, useEnvironment } from '@lib';

export const ImpersonatingBanner = () => {
    const user = useCurrentUser()
    const env = useEnvironment()

    if (!env.isImpersonating) return null

    return (
        <Box bg='osOrange'>
            <Container p='md'bg='osOrange'>
                <Center>
                    <Group>
                        <Title order={6}>
                            Currently viewing as {user.firstName} {user.lastName}
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
