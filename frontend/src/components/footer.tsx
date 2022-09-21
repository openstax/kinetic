import { React, cx } from '@common'
import styled from '@emotion/styled'
import { ResourceLinks, HelpLink } from './resource-links'
import { colors } from '../theme'
import {
    Icon, Box, Row, Col,
} from '@components'

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

const Supporter = styled.a({
    display: 'flex',
    alignItems: 'center',
})

const Funders = () => {
    return (
        <div css={{ backgroundColor: colors.white }}>
            <Box className="container-lg" direction="column" padding={{ vertical: 'xlarge' }}>
                <h4 css={{ fontWeight: 'bold' }}>Support from Scientific Agencies</h4>

                <Box direction="column" css={{ maxWidth: 600, margin: 'auto' }}>
                    <Box wrap justify='center' margin={{ vertical: 'large' }} gap="xxlarge">
                        <Supporter target="_blank" href="https://ies.ed.gov/"><img alt="Institute of Education Sciences logo" src={IESLogoURL} /></Supporter>
                        <Supporter target="_blank" href="https://www.nsf.org/gb/en"><img alt="National Science Foundation logo" src={NSFLogoURL} /></Supporter>
                    </Box>

                    <a href="https://openstax.org/foundation" className="mb-2">View Other Philanthropic Supporters</a>
                    <p css={{ color: colors.grayText }}>
                        *The research reported here was supported by the Institute of Education Sciences, U.S. Department of Education, through Grant R305N210064 to Rice University. The opinions expressed are those of the authors and do not represent views of the Institute or the U.S. Department of Education.
                    </p>
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
                            <div><img alt="Rice University logo" height="30" src={RiceLogoURL} /></div>
                            <div><img alt="Open Stax logo" height="30" src={OpenStaxURL} /></div>
                        </Col>

                    </Row>
                </div>
            </div>
        </div >
    )
}
