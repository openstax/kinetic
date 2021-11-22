import { useHistory, useRouteMatch } from 'react-router-dom'
import { React } from '@common'
import { Button, IncorrectUser, Box } from '@components'
import { useQueryParam, useCurrentUser, useStudyApi, isIframed, sendMessageToParent } from '@lib'
import { useEffect } from 'react'


const NoConsentMessage:React.FC<{ onReturnClick(): void }> = ({ onReturnClick }) => (
    <Box direction="column" align="center">
        <h3>Your responses for the study have been discarded</h3>
        <p>Want to check out other studies?</p>
        <Button primary data-test-id="view-studies" onClick={onReturnClick}>Return to dashboard</Button>
    </Box>
)

const CompletedMessage:React.FC<{ onReturnClick(): void }> = ({ onReturnClick }) => (
    <Box direction="column" align="center">
        <h3>Thank you for completing the study</h3>
        <h5>your response has been recorded</h5>
        <Button primary data-test-id="view-studies" onClick={onReturnClick}>Return to dashboard</Button>
    </Box>
)


export default function UsersStudies() {
    const { params: { studyId } } = useRouteMatch<{ studyId: string }>();
    const api = useStudyApi()
    const history = useHistory()
    const user = useCurrentUser()
    const noConsent = useQueryParam('consent') != 'true'

    if (!user) {
        return <IncorrectUser />
    }

    const onNav = () => {
        if (isIframed()) {
            sendMessageToParent({ closeStudyModal: true })
        } else {
            history.push('/studies')
        }
    }

    useEffect(() => {
        let isPreview = false
        try {
            isPreview = Boolean(
                window.parent.document.querySelector('[data-is-study-preview-modal="true"]')
            )
        } catch { }
        if (!isPreview) {
            api.landStudy({ id: Number(studyId) })
        }
    }, [ studyId ])
    const Body = noConsent ? NoConsentMessage : CompletedMessage
    return (

        <div className="container studies mt-8">
            <Body onReturnClick={onNav} />
        </div>
    )

}
