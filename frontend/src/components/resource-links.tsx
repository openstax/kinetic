import { React } from '@common'
import { useCurrentUser } from '@lib';
import { Anchor, Stack, Text, Title } from '@mantine/core';

export const ResourceLinks = () => {
    return (
        <Stack gap='xs'>
            <Title order={4}>Resources</Title>
            <Anchor c='inherit' underline='always' target="_blank" href="https://help.openstax.org/s/article/Kinetic-Learner-Student-FAQs">
                FAQs
            </Anchor>
            <Anchor c='inherit' underline='always' target="_blank" href="https://openstax.org/privacy-policy">
                Privacy Policy
            </Anchor>
        </Stack>
    )
}

export const HelpLink = () => {
    const isResearcher = useCurrentUser().isResearcher
    return (
        <Stack gap='xs'>
            <Title order={4}>Need Help?</Title>
            {isResearcher ?
                <Text>
                    Contact us at <Anchor underline='always' target="_blank" href="mailto:kinetic@openstax.org">kinetic@openstax.org</Anchor>
                </Text> :
                <Anchor c='inherit' underline='always' target="_blank" href="https://openstax.org/contact">
                    Contact us here
                </Anchor>
            }
        </Stack>
    )
}
