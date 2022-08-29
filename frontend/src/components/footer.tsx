import { React } from '@common'
import { colors } from '../theme'
import {
    Icon, Box, Row, Col,
} from '@components'

// @ts-ignore
import NSFLogoURL from '../images/nsf-logo.png'
// @ts-ignore
import IESLogoURL from '../images/ies-logo.png'
// @ts-ignore
import SFLogoURL from '../images/sf-logo.png'
// @ts-ignore
import RiceLogoURL from '../images/rice-logo.png'

import envelopeIcon from '@iconify-icons/bi/envelope'
import fbIcon from '@iconify-icons/bi/facebook'
import scIcon from '@iconify-icons/bi/snapchat'
import twIcon from '@iconify-icons/bi/twitter'

const Funders = () => {
    return (
        <div css={{ backgroundColor: colors.gray }}>
            <Box className="container-lg" direction="column" padding={{ vertical: 'xlarge' }}>
                <h5 css={{ fontWeight: 'bold' }}>Funder & Partner</h5>

                <Box wrap gap="large" justify='around'>
                    <a target="_blank" href="https://www.nsf.org/gb/en"><img height="80" alt="National Science Foundation logo" src={NSFLogoURL} /></a>
                    <a target="_blank" href="https://ies.ed.gov/"><img alt="Institute of Education Sciences logo" height="80" src={IESLogoURL} /></a>
                    <a target="_blank" href="https://www.schmidtfutures.com/"><img height="80" src={SFLogoURL} alt="Schmidt Futures log" /></a>
                    <a target="_blank" href="https://www.rice.edu/"><img alt="Rice University logo" height="80" src={RiceLogoURL} /></a>
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
                                <a href="http://facebook.com"><Icon icon={fbIcon} /></a>
                                <a href="http://snapchat.com"><Icon icon={scIcon} /></a>
                                <a href="http://twitter.com"><Icon icon={twIcon} /></a>
                            </Box>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
