import { React } from '@common'
import { HelpLink, ResourceLinks } from './resource-links'
import { colors } from '@theme'
import { useIsMobileDevice } from '@lib';
import { Divider,Anchor, Box, Container, Flex, Group, Image, Stack, Text, Title } from '@mantine/core';
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
        <Container style={{ backgroundColor: 'white', width: '100%', padding: '16px 32px 40px 32px' }}>
        <Stack spacing="md">
        <Title
          order={2}
          style={{
            fontFamily: 'Helvetica Neue',
            fontSize: '36px',
            fontWeight: 700,
            lineHeight: '42px',
            letterSpacing: '-0.04em',
            textAlign: 'left',
          }}
        >
          Support from scientific agencies
        </Title>
          
          <Flex
            style={{
              width: '100%',
              height: '256px',
              padding: '16px 0',
              gap: '0px',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Anchor target="_blank" href="https://www.nsf.org/gb/en">
              <Image 
                alt="National Science Foundation logo" 
                src={NSFLogoURL} 
                width={163.21} 
                height={120} 
                style={{ objectFit: 'cover', padding: '0px 32px' }} 
              />
            </Anchor>
    
            <Divider orientation="vertical" style={{ height: '200px', width: '1px', borderWidth: '1px' }} />
    
            <Anchor target="_blank" href="https://ies.ed.gov/">
              <Stack
                align="center"
                spacing="sm"
                style={{
                  width: '462.66px',
                  height: '186.76px',
                  padding: '0px 32px',
                  gap: '16px',
                }}
              >
                <Image 
                  alt="Institute of Education Sciences logo" 
                  src={IESLogoURL} 
                  width={371.5} 
                  height={98.76} 
                  style={{ objectFit: 'cover', gap: '0px' }} 
                />
                <Text
                  size="xs"
                style={{
                  fontFamily: 'Helvetica Neue',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '18px',
                  textAlign: 'center',
                  color: 'black',
                  textDecoration: 'none',
                }}
                >
                  The research reported here was supported by the Institute of Education Sciences, U.S. Department of Education, through Grant R305N210064 to Rice University. The opinions expressed are those of the authors and do not represent views of the Institute or the U.S. Department of Education.
                </Text>
              </Stack>
            </Anchor>
    
            <Divider orientation="vertical" style={{ height: '200px', width: '1px', borderWidth: '1px' }} />
    
            <Anchor href="https://openstax.org/foundation">
              <Text color="blue" weight={500} style={{ textAlign: 'center' }}>View other Philanthropic supporters</Text>
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
        <Flex direction={{ sm: 'row' }} gap='xl'>
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
