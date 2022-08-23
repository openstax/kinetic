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
                    <img height="80" src={NSFLogoURL} />
                    <img height="80" src={IESLogoURL} />
                    <img height="80" src={SFLogoURL} />
                    <img height="80" src={RiceLogoURL} />
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
                        <Col direction="column">
                            <b>Need Help?</b>
                            <a className="text-decoration-none" href="mailto:kinetic@openstax.org?subject=[Kinetic help]"><Icon icon={envelopeIcon} /> Contact us at kinetic@openstax.org</a>
                        </Col>
                        <Col direction="column">
                            <b>Resource</b>
                            <a href="https://openstax.org/privacy-policy">FAQs</a>
                            <a href="https://openstax.org/privacy-policy">Privacy Policy</a>
                        </Col>
                        <Col direction="column">
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
