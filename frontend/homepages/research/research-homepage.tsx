import { Box, React, styled } from '@common'

import '../../src/styles/cms-page.scss'
import { colors, media } from '../../src/theme';
import { Funders, Icon, OXColoredStripe } from '@components';
import { Button } from '@restart/ui';
import BannerImage from './images/landing/banner-image.png';
import { SSRProvider } from '@restart/ui/ssr';
import { MembersSection } from './components/members';
import { ResearchSection } from './components/research-areas';
import { Publications } from './components/publications';

export const ResearchHomepage = () => {
    return (
        <SSRProvider>
            <div>
                <Header/>
                {/*<Banner></Banner>*/}
                <ResearchSection/>
                <Publications/>
                <MembersSection/>
                <Section>
                    <Funders/>
                </Section>
                <ContactUs/>
            </div>
        </SSRProvider>
    )
}

export const Section: FCWC<{backgroundColor?: string}> = ({ children, backgroundColor= colors.white }) => {
    return (
        <div css={{
            backgroundColor: backgroundColor,
            padding: '60px 0',
            [media.mobile]: {
                padding: '50px 0',
            },
        }}>
            <div className='container' css={{ maxWidth: '120rem !important' }}>
                {children}
            </div>
        </div>
    )
}

export const HeaderImage = styled.img({
    width: '35%',
    [media.mobile]: {
        width: '85%',
    },
    [media.tablet]: {
        width: '85%',
    },
})

export const Header = () => (
    <Section backgroundColor={colors.lightBlue}>
        <Box direction={{ mobile: 'column', tablet: 'column', desktop: 'row' }} align='center'>
            <h1 css={{ color: colors.white, flex: 5 }} className='fw-bolder'>
                Advancing interdisciplinary research in learning sciences, education, and allied disciplines, to improve learner success.
            </h1>
            <HeaderImage src={BannerImage} alt='banner-image' css={{ flex: 2 }} />
        </Box>
    </Section>
)

// TODO Next banner will go up in January, we dont want to use this until then. Saving for later
export const Banner = () => (
    <div css={{ backgroundColor: colors.lightTeal }}>
        <Box direction={{ mobile: 'column' }} className='container align-items-center py-2' gap='medium'>
            <h4 className='fw-bold' css={{ color: colors.blackText, flex: 1 }}>
                Calling all learning researchers!
            </h4>
            <Box align={{ mobile: 'center' }} className='justify-content-center' direction='column' css={{ flex: 4 }}>
                <span>Learn about the research workflow on OpenStax Kinetic during office hours hosted with IES!</span>
                <a className='text-decoration-none' href='https://ies.ed.gov/funding/technicalassistance.asp' target='_blank'>
                    <Box align='center'>
                        IES Office Hours
                        &nbsp;
                        <Icon icon='boxArrowInUpRight'></Icon>
                    </Box>
                </a>
            </Box>
        </Box>
        <OXColoredStripe/>
    </div>
)


export const ContactUs = () => (
    <div css={{ backgroundColor: colors.lightTeal }}>
        <Box className='py-3 container' direction={{ mobile: 'column' }} align='center' gap='xlarge' css={{ maxWidth: '120rem !important' }}>
            <h3>Connect with our Research Team</h3>
            <Button
                as='a'
                href='https://riceuniversity.co1.qualtrics.com/jfe/form/SV_6EbRsmpDb2Hs69w?jfefe=new'
                target='_blank'
                css={{
                    color: `${colors.white} !important`,
                    backgroundColor: `${colors.primaryButton} !important`,
                }}
                className='btn btn-lg'>
                Contact Us
            </Button>
        </Box>
    </div>
)
