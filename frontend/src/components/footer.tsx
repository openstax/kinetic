import { React, cx } from '@common'
import { ResourceLinks, HelpLink } from './resource-links'
import { colors } from '../theme'
import {
    Icon, Box, Row, Col,
} from '@components'

// @ts-ignore
import NSFLogoURL from '../images/nsf-logo.png'
// @ts-ignore
import IESLogoURL from '../images/ies-logo.png'
// @ts-ignore
import RiceLogoURL from '../images/rice-logo.png'
// @ts-ignore
import OpenStaxURL from '../images/openstax-logo.png'


import fbIcon from '@iconify-icons/bi/facebook'
import igIcon from '@iconify-icons/bi/instagram'
import twIcon from '@iconify-icons/bi/twitter'

const Funders = () => {
    return (
        <div css={{ backgroundColor: colors.gray }}>
            <Box className="container-lg" direction="column" padding={{ vertical: 'xlarge' }}>
                <h5 css={{ fontWeight: 'bold' }}>Support from Scientific Agencies</h5>
                <a href="https://openstax.org/foundation" className="mb-2">View more supporters</a>
                <Box wrap gap="large" justify='around'>
                    <a target="_blank" href="https://www.nsf.org/gb/en"><img height="80" alt="National Science Foundation logo" src={NSFLogoURL} /></a>
                    <a target="_blank" href="https://ies.ed.gov/"><img alt="Institute of Education Sciences logo" height="80" src={IESLogoURL} /></a>
                </Box>
            </Box>
        </div>
    )
}
export const Footer: React.FC<{ className?: string, includeFunders?: boolean }> = ({ className, includeFunders }) => {
    return (
        <div className={cx('footer', 'mt-4', className)}>
            {includeFunders && < Funders />}
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
                            <div><img alt="Rice University logo" height="38" src={RiceLogoURL} /></div>
                            <div><img alt="Open Stax logo" height="33" src={OpenStaxURL} /></div>
                        </Col>

                    </Row>
                </div>
            </div>
        </div >
    )
}
