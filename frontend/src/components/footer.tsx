import { React } from '@common'
import { HelpLink, ResourceLinks } from './resource-links'
import { colors } from '@theme'
import { useIsMobileDevice } from '@lib'
import { Anchor, Box, Container, Flex, Group, Image, Stack, Text, Title, Divider } from '@mantine/core';
import { IconBrandFacebookFilled, IconBrandInstagram, IconBrandTwitterFilled } from '@tabler/icons-react';

// @ts-ignore
import NSFLogoURL from '../images/nsf-logo.webp'
// @ts-ignore
import IESLogoURL from '../images/ies-logo.png'
// @ts-ignore
import RiceLogoURL from '../images/rice-logo.png'
// @ts-ignore
import OpenStaxURL from '../images/openstax-logo.png'

const FunderTitle = () => (
    <Title
        order={2}
        w={700}
        style={{
            fontFamily: 'Helvetica Neue',
            fontSize: '32px',
            lineHeight: '1.75rem',
            textAlign: 'left',
        }}
    >
    Support from scientific agencies
    </Title>
);

const NSFLogo = () => (
    <Anchor
        target='_blank'
        href='https://www.nsf.org/gb/en'
        pl={{ base: 0, sm: 75, md: 150 }}
        pt={{ base: 0, sm: 25, md: 50 }}
        style={{ display: 'flex', alignItems: 'center' }}
    >
        <Image
            w={{ base: 120, sm: 140, md: 163 }}
            h={{ base: 88, sm: 103, md: 120 }}
            alt='National Science Foundation logo'
            src={NSFLogoURL}
        />
    </Anchor>
);

const IESSection = () => (
    <Box style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        h: { base: 'auto', sm: '200px' },
        padding: '10px 0',
        w: { base: '100%', sm: 'auto' },
    }}>
        <Anchor target='_blank' href='https://ies.ed.gov/' style={{ marginBottom: 16 }}>
            <Image
                width={371}
                height={99}
                alt='Institute of Education Sciences logo'
                src={IESLogoURL}
                fit="contain"
            />
        </Anchor>
        <Text 
            size={{ base: 'sm', sm: 'md' } as any}
            color='dimmed' 
            style={{ 
                lineHeight: 1.2,
                textAlign: 'center',
                fontSize: '11px',
                width: '371px',
                height: '4.8em',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
            }}
        >
      The research reported here was supported by the Institute of Education Sciences, U.S. Department of Education, through Grant R305N210064 to Rice University. The opinions expressed are those of the authors and do not represent views of the Institute or the U.S. Department of Education.
        </Text>
    </Box>
);

interface PhilanthropicSupportersLinkProps {
    isMobile: boolean;
}

const PhilanthropicSupportersLink: React.FC<PhilanthropicSupportersLinkProps> = ({ isMobile }) => (
    <Anchor
        href='https://openstax.org/foundation'
        c='blue'
        size={{ base: 'md', sm: 'lg' } as any}
        pt={{ base: 0, sm: 50, md: 100 }}
        style={{ 
            textAlign: 'center', 
            display: 'flex', 
            alignItems: 'center', 
            lineHeight: 1.2,
        }}
    >
        {isMobile ? (
            'View other Philanthropic supporters'
        ) : (
            <>
        View other<br/>
        Philanthropic<br/>
        supporters
            </>
        )}
    </Anchor>
);

const Funders = () => {
    const isMobile = useIsMobileDevice();

    return (
        <Container
            bg='white'
            px={{ base: 16, sm: 32 }}
            pt={16}
            pb={40}
        >
            <Stack gap="md">
                <FunderTitle />
                <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    justify="space-between"
                    align={{ base: 'center', sm: 'flex-start' }}
                    gap={{ base: 'md', sm: 'sm' }}
                >
                    <NSFLogo />
                    {!isMobile && <Divider orientation="vertical" h={200} />}
                    <IESSection />
                    {!isMobile && <Divider orientation="vertical" h={200} />}
                    <PhilanthropicSupportersLink isMobile={isMobile} />
                </Flex>
            </Stack>
        </Container>
    );
};

export const SocialLinks = () => {
    return (
        <Stack>
            <Title order={4}>Follow us</Title>
            <Group>
                <Anchor
                    c='white'
                    target='_blank'
                    href='https://www.facebook.com/openstax'
                >
                    <IconBrandFacebookFilled />
                </Anchor>
                <Anchor
                    c='white'
                    target='_blank'
                    href='https://www.instagram.com/openstax/'
                >
                    <IconBrandInstagram />
                </Anchor>
                <Anchor
                    c='white'
                    target='_blank'
                    href='https://twitter.com/OpenStax'
                >
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
                <Image
                    alt='Rice University logo'
                    h='30'
                    w='auto'
                    src={RiceLogoURL}
                />
            </Anchor>
            <Anchor target='_blank' href='https://www.openstax.org'>
                <Image alt='Open Stax logo' h='30' src={OpenStaxURL} />
            </Anchor>
        </Flex>
    );
};

export const Footer: React.FC<{ includeFunders?: boolean }> = ({
    includeFunders,
}) => {
    const isMobile = useIsMobileDevice();

    return (
        <div>
            {includeFunders && <Funders />}
            <Box bg='navy' c='white'>
                <Container bg='navy'>
                    {isMobile ? (
                        <Stack py='lg'>
                            <HelpLink />
                            <ResourceLinks />
                            <SocialLinks />
                            <Logos />
                        </Stack>
                    ) : (
                        <Group py='xl' align='start' justify='space-between'>
                            <HelpLink />
                            <ResourceLinks />
                            <SocialLinks />
                            <Logos />
                        </Group>
                    )}
                </Container>
            </Box>
        </div>
    );
};