import { React } from '@common'
import { useCurrentUser } from '@lib';

export const ResourceLinks = () => {
    return (
        <>
            <h4>Resources</h4>
            <a target="_blank" href="https://help.openstax.org/s/article/kinetic">FAQs</a>
            <a target="_blank" href="https://openstax.org/privacy-policy">Privacy Policy</a>
        </>
    )
}

export const HelpLink = () => {
    const isResearcher = useCurrentUser()?.isResearcher
    return (
        <>
            <h4>Need Help?</h4>
            {isResearcher ?
                <span>Contact us at <a target="_blank" href="mailto:kinetic@openstax.org">kinetic@openstax.org</a></span> :
                <a target="_blank" href="https://openstax.org/contact">Contact us here</a>
            }
        </>
    )
}
