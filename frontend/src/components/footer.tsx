import { React } from '@common'
import { HelpLink, ResourceLinks } from './resource-links'
import { colors } from '@theme'
import { useIsMobileDevice } from '@lib';
import { Anchor, Box, Container, Flex, Group, Image, Stack, Text, Title } from '@mantine/core';
import { IconBrandFacebookFilled, IconBrandInstagram, IconBrandTwitterFilled } from '@tabler/icons-react';

// @ts-ignore
import NSFLogoURL from '../images/nsf-logo.webp'
// @ts-ignore
import IESLogoURL from '../images/ies-logo.webp'
// @ts-ignore
import RiceLogoURL from '../images/rice-logo.png'
// @ts-ignore
import OpenStaxURL from '../images/openstax-logo.png'

const Funders = () => {
    return (
        <Container bg='white'>
            <Stack>
                <Title order={4} className="fw-bold">Support from Scientific Agencies</Title>
                <Flex justify='center' align='center' mx='auto'>
                    <Anchor target="_blank" href="https://ies.ed.gov/">
                        <Image alt="Institute of Education Sciences logo" src={IESLogoURL}/>
                    </Anchor>
                    <Anchor target="_blank" href="https://www.nsf.org/gb/en">
                        <Image alt="National Science Foundation logo" src={NSFLogoURL} />
                    </Anchor>
                </Flex>

                <Stack gap='md' mb='md'>
                    <Anchor href="https://openstax.org/foundation">
                        View Other Philanthropic Supporters
                    </Anchor>

                    <Text size='xs' c={colors.text}>
                        *The research reported here was supported by the Institute of Education Sciences, U.S. Department of Education, through Grant R305N210064 to Rice University. The opinions expressed are those of the authors and do not represent views of the Institute or the U.S. Department of Education.
                    </Text>
                </Stack>
            </Stack>
        </Container>
    )
}

export const DesktopFooter: React.FC = () => {
    return (
        <Box bg='navy' c='white'>
            <Container bg='navy'>
                <Group py='xl' align='start' justify='space-between'>
                    <HelpLink />
                    <ResourceLinks />
                    <SocialLinks />
                    <Logos />
                </Group>
            </Container>
        </Box>
    )
}

export const MobileFooter: React.FC = () => {
    return (
        <Container bg='navy' c='white' style={{
            'a': {
                color: colors.white,
            },
        }}>
            <Stack py='lg'>
                <HelpLink />
                <ResourceLinks />
                <SocialLinks />
                <Logos />
            </Stack>
        </Container>
    )
}

export const SocialLinks = () => {
    return (
        <Stack>
            <Title order={4}>Follow us</Title>
            <Group>
                <Anchor c='white' target="_blank" href="https://www.facebook.com/openstax">
                    <IconBrandFacebookFilled />
                </Anchor>
                <Anchor c='white' target="_blank" href="https://www.instagram.com/openstax/">
                    <IconBrandInstagram />
                </Anchor>
                <Anchor c='white' target="_blank" href="https://twitter.com/OpenStax">
                    <IconBrandTwitterFilled />
                </Anchor>
            </Group>
        </Stack>
    )
}

export const Logos = () => {
    return (
        <Flex direction={{ sm: 'column' }} gap='xl'>
            <Anchor target='_blank' href='https://www.rice.edu'>
                <Image alt="Rice University logo" h="30" w='auto' src={RiceLogoURL} />
            </Anchor>
            <Anchor target='_blank' href='https://www.openstax.org'>
                <Image alt="Open Stax logo" h="30" src={OpenStaxURL} />
            </Anchor>
        </Flex>
    )
}


export const Footer: React.FC<{ includeFunders?: boolean }> = ({ includeFunders }) => {
    return (
        <div>
            {includeFunders && < Funders />}
            {useIsMobileDevice() ? <MobileFooter/> : <DesktopFooter/>}
        </div>
    )
}
