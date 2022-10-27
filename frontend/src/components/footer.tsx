import { cx, React } from '@common'
import styled from '@emotion/styled'
import { HelpLink, ResourceLinks } from './resource-links'
import { colors } from '../theme'
import { Box, Col, Icon, Row } from '@components'

// @ts-ignore
import NSFLogoURL from '../images/nsf-logo.webp'
// @ts-ignore
import IESLogoURL from '../images/ies-logo.webp'
// @ts-ignore
import RiceLogoURL from '../images/rice-logo.png'
// @ts-ignore
import OpenStaxURL from '../images/openstax-logo.png'

import fbIcon from '@iconify-icons/bi/facebook'
import igIcon from '@iconify-icons/bi/instagram'
import twIcon from '@iconify-icons/bi/twitter'
import { useIsMobileDevice } from '@lib';

const Supporter = styled.a({
    display: 'flex',
    alignItems: 'center',
})

const SupporterImage = styled.img({
    width: '100%',
    height: 'auto',
})

const Funders = () => {
    return (
        <div css={{ backgroundColor: colors.white }}>
            <Box direction="column" className='p-2'>
                <h4 className="fw-bold">Support from Scientific Agencies</h4>
                <div css={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '600px',
                    margin: 'auto',
                    alignItems: 'center',
                }}>
                    <Box justify='evenly'>
                        <Supporter target="_blank" href="https://ies.ed.gov/">
                            <SupporterImage alt="Institute of Education Sciences logo" src={IESLogoURL} />
                        </Supporter>
                        <Supporter target="_blank" href="https://www.nsf.org/gb/en">
                            <SupporterImage alt="National Science Foundation logo" src={NSFLogoURL} />
                        </Supporter>
                    </Box>

                    <div>
                        <a href="https://openstax.org/foundation" className="mb-2">
                            View Other Philanthropic Supporters
                        </a>

                        <p className="x-small" css={{ color: colors.grayText }}>
                            *The research reported here was supported by the Institute of Education Sciences, U.S. Department of Education, through Grant R305N210064 to Rice University. The opinions expressed are those of the authors and do not represent views of the Institute or the U.S. Department of Education.
                        </p>
                    </div>
                </div>
            </Box>
        </div>
    )
}

export const MobileFooter: React.FC<{ className?: string, includeFunders?: boolean }> = () => {
    return (
        <div css={{ backgroundColor: colors.darkBlue, color: 'white', a: { color: 'white' } }}>
            <div className='container-lg'>
                <Row className="py-1">
                    <Row className="py-1">
                        <HelpLink />
                    </Row>

                    <Row className="py-1">
                        <ResourceLinks />
                    </Row>

                    <Row className="py-1">
                        <h4>Follow us</h4>
                        <Box gap>
                            <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https://kinetic.openstax.org">
                                <Icon icon={fbIcon} height={30}/>
                            </a>
                            <a target="_blank" href="https://www.instagram.com/openstax/">
                                <Icon icon={igIcon} height={30}/>
                            </a>
                            <a target="_blank" href="https://twitter.com/intent/tweet?text=https://kinetic.openstax.org">
                                <Icon icon={twIcon} height={30}/>
                            </a>
                        </Box>
                    </Row>
                    <Col className="py-1">
                        <a href="https://www.rice.edu/" target="_blank">
                            <img alt="Rice University logo" height="30" src={RiceLogoURL}/>
                        </a>
                        <a href="https://openstax.org/" target="_blank" css={{ marginLeft: '60px' }}>
                            <img alt="Open Stax logo" height="30" src={OpenStaxURL}/>
                        </a>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export const DesktopFooter: React.FC<{ className?: string, includeFunders?: boolean }> = () => {
    return (
        <div css={{ backgroundColor: colors.darkBlue, color: 'white', a: { color: 'white' } }}>
            <div className='container-lg'>
                <Row css={{ padding: '20px 0' }}>
                    <Col auto direction="column">
                        <HelpLink />
                    </Col>
                    <Col auto direction="column">
                        <ResourceLinks />
                    </Col>
                    <Col auto direction="column">
                        <b>Follow us</b>
                        <Box gap>
                            <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https://kinetic.openstax.org"><Icon icon={fbIcon} /></a>
                            <a target="_blank" href="https://www.instagram.com/openstax/"><Icon icon={igIcon} /></a>
                            <a target="_blank" href="https://twitter.com/intent/tweet?text=https://kinetic.openstax.org"><Icon icon={twIcon} /></a>
                        </Box>
                    </Col>
                    <Col auto direction="column" gap>
                        <div><img alt="Rice University logo" height="30" src={RiceLogoURL} /></div>
                        <div><img alt="Open Stax logo" height="30" src={OpenStaxURL} /></div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export const Footer: React.FC<{ className?: string, includeFunders?: boolean }> = ({ className, includeFunders }) => {
    return (
        <div className={cx('footer', 'mt-4', className)}>
            {includeFunders && < Funders />}
            {useIsMobileDevice() ? <MobileFooter/> : <DesktopFooter/>}
        </div>
    )
}
