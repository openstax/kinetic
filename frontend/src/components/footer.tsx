import { React } from '@common'
import { colors } from '../theme'
import {
    Icon, Box, Row, Col,
} from '@components'

// @ts-ignore
import NSFLogoURL from '../images/nsf-logo.png'
// @ts-ignore
import IESLogoURL from '../images/ies-logo.png'

import envelopeIcon from '@iconify-icons/bi/envelope'
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
export const Footer: React.FC<{ includeFunders?: boolean }> = ({ includeFunders }) => {
    return (
        <div className="footer mt-4">
            {includeFunders && < Funders />}
            <div css={{ backgroundColor: 'black', color: 'white', a: { color: 'white', textDecoration: 'none' } }}>
                <div className='container-lg'>
                    <Row css={{ padding: '20px 0' }}>
                        <Col auto direction="column">
                            <b>Need Help?</b>
                            <a className="text-decoration-none" href="mailto:kinetic@openstax.org?subject=[Kinetic help]"><Icon icon={envelopeIcon} /> Contact us at kinetic@openstax.org</a>
                        </Col>
                        <Col auto direction="column">
                            <b>Resource</b>
                            <a href="https://openstax.org/privacy-policy">FAQs</a>
                            <a href="https://openstax.org/privacy-policy">Privacy Policy</a>
                        </Col>
                        <Col auto direction="column">
                            <b>Follow us</b>
                            <Box gap>
                                <a href="https://www.facebook.com/sharer/sharer.php?u=https://kinetic.openstax.org"><Icon icon={fbIcon} /></a>
                                <a href="https://www.instagram.com/openstax/"><Icon icon={igIcon} /></a>
                                <a href="https://twitter.com/intent/tweet?text=https://kinetic.openstax.org"><Icon icon={twIcon} /></a>
                            </Box>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
