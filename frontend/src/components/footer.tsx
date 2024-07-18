import { React } from '@common';
import { HelpLink, ResourceLinks } from './resource-links';
import { useIsMobileDevice } from '@lib';
import { useMediaQuery } from '@mantine/hooks';
import { Anchor, Box, Container, Flex, Group, Image, Stack, Text, Title } from '@mantine/core';
import { IconBrandFacebookFilled, IconBrandInstagram, IconBrandTwitterFilled } from '@tabler/icons-react';
import { colors } from '@theme';


// @ts-ignore
import NSFLogoURL from '../images/nsf-logo.webp'
// @ts-ignore
import IESLogoURL from '../images/ies-logo.webp'
// @ts-ignore
import RiceLogoURL from '../images/rice-logo.png'
// @ts-ignore
import OpenStaxURL from '../images/openstax-logo.png'

const Funders = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');

    return (
        <Container bg="white" px={isMobile ? 16 : 32} pt={16} pb={40}>
            <Stack gap={isMobile ? 'md' : 'lg'}>
                <Title
                    order={2}
                    w={700}
                    style={{
                        fontFamily: 'Helvetica Neue',
                        fontSize: '32px',
                        lineHeight: isMobile
                            ? '28px'
                            : isTablet
                                ? '36px'
                                : '42px',

                        textAlign: 'left',
                    }}
                >
                    Support from scientific agencies
                </Title>
                <Flex
                    direction={isMobile ? 'column' : 'row'}
                    justify={isMobile ? 'flex-start' : 'space-between'}
                    align={isMobile ? 'center' : 'flex-start'}
                    gap={isMobile ? 'md' : 'sm'}
                >
                    <Anchor
                        target="_blank"
                        href="https://www.nsf.org/gb/en"
                        pl={isMobile ? 0 : isTablet ? 75 : 150}
                        pt={isMobile ? 0 : isTablet ? 25 : 50}
                    >
                        <Image
                            width={isMobile ? 120 : isTablet ? 140 : 163}
                            height={isMobile ? 88 : isTablet ? 103 : 120}
                            alt="National Science Foundation logo"
                            src={NSFLogoURL}
                        />
                    </Anchor>
                    <Box maw={isMobile ? '100%' : 400}>
                        <Anchor target="_blank" href="https://ies.ed.gov/">
                            <Image
                                width={isMobile ? '100%' : 250}
                                alt="Institute of Education Sciences logo"
                                src={IESLogoURL}
                            />
                        </Anchor>
                        <Text size={isMobile ? 'sm' : 'md'} mt="xs">
                            The research reported here was supported by the
                            Institute of Education Sciences, U.S. Department of
                            Education, through Grant R305N210064 to Rice
                            University. The opinions expressed are those of the
                            authors and do not represent views of the Institute
                            or the U.S. Department of Education.
                        </Text>
                    </Box>
                    <Anchor
                        href="https://openstax.org/foundation"
                        c="blue"
                        size={isMobile ? 'md' : 'lg'}
                        pt={isMobile ? 0 : isTablet ? 50 : 100}
                    >
                        View other Philanthropic supporters
                    </Anchor>
                </Flex>
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
        <Container
            bg="navy"
            c="white"
            style={{
                a: {
                    color: colors.white,
                },
            }}
        >
            <Stack py="lg">
                <HelpLink />
                <ResourceLinks />
                <SocialLinks />
                <Logos />
            </Stack>
        </Container>
    );
};

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
    );
};

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
    );
};

export const Footer: React.FC<{ includeFunders?: boolean }> = ({ includeFunders }) => {
    return (
        <div>
            {includeFunders && < Funders />}
            {useIsMobileDevice() ? <MobileFooter/> : <DesktopFooter/>}
        </div>
    )
}
