import { React } from '@common'
import { HelpLink, ResourceLinks } from './resource-links'
import { useIsMobileDevice } from '@lib';
import { Divider, Anchor, Box, Container, Flex, Group, Image, Stack, Text, Title } from '@mantine/core';
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
        <Container bg="white" w="100%" p="md">
            <Stack gap="md">
                <Title order={2} fz={36} fw={700} lh="42px" ta="left" ff="Helvetica Neue" lts="-0.04em">
                    Support from scientific agencies
                </Title>
          
                <Flex w="100%" h={256} py="md" justify="space-between" align="center">
                    <Anchor target="_blank" href="https://www.nsf.org/gb/en">
                        <Image 
                            alt="National Science Foundation logo" 
                            src={NSFLogoURL} 
                            w={163.21} 
                            h={120} 
                            fit="cover"
                            px="md"
                        />
                    </Anchor>
    
                    <Divider orientation="vertical" h={200} w={1} />
    
                    <Anchor target="_blank" href="https://ies.ed.gov/">
                        <Stack align="center" gap="sm" w={462.66} h={186.76} px="md">
                            <Image 
                                alt="Institute of Education Sciences logo" 
                                src={IESLogoURL} 
                                w={371.5} 
                                h={98.76} 
                                fit="cover"
                            />
                            <Text
                                size="xs"
                                ff="Helvetica Neue"
                                fw={400}
                                fz={12}
                                lh="18px"
                                ta="center"
                                c="black"
                            >
                                The research reported here was supported by the Institute of Education Sciences, U.S. Department of Education, through Grant R305N210064 to Rice University. The opinions expressed are those of the authors and do not represent views of the Institute or the U.S. Department of Education.
                            </Text>
                        </Stack>
                    </Anchor>
    
                    <Divider orientation="vertical" h={200} w={1} />
    
                    <Anchor href="https://openstax.org/foundation">
                        <Text c="blue" fw={500} ta="center">View other Philanthropic supporters</Text>
                    </Anchor>
                </Flex>
            </Stack>
        </Container>
    );
};

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
        <Container bg='navy' c='white' >
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
        <Flex direction={{ sm: 'row' }} gap='xl'>
            <Anchor target='_blank' href='https://www.rice.edu'>
                <Image alt="Rice University logo" h={30} w='auto' src={RiceLogoURL} />
            </Anchor>
            <Anchor target='_blank' href='https://www.openstax.org'>
                <Image alt="Open Stax logo" h={30} src={OpenStaxURL} />
            </Anchor>
        </Flex>
    )
}

export const Footer: React.FC<{ includeFunders?: boolean }> = ({ includeFunders }) => {
    return (
        <div>
            {includeFunders && <Funders />}
            {useIsMobileDevice() ? <MobileFooter /> : <DesktopFooter />}
        </div>
    )
}