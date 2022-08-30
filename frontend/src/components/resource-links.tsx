import { React } from '@common'
import envelopeIcon from '@iconify-icons/bi/envelope'
import { Icon } from './icon'

export const ResourceLinks = () => {
    return (
        <>
            <h4>Resource</h4>
            <a href="https://openstax.org/privacy-policy">FAQs</a>
            <a href="https://openstax.org/privacy-policy">Privacy Policy</a>
        </>
    )
}

export const HelpLink = () => {
    return (
        <>
            <b>Need Help?</b>
            <a className="text-decoration-none" href="mailto:kinetic@openstax.org?subject=[Kinetic help]"><Icon icon={envelopeIcon} /> Contact us at kinetic@openstax.org</a>
        </>
    )
}
