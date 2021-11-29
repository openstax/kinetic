import { Redirect, useHistory, useRouteMatch } from 'react-router-dom'
import { React, useEffect, useState } from '@common'
import { LandStudyAbortedEnum, LandStudyRequest } from '@api'
import { Button, IncorrectUser, Box, LoadingAnimation, ErrorPage } from '@components'
import { useQueryParam, useCurrentUser, useStudyApi, isIframed, sendMessageToParent } from '@lib'
import type { ReactElement } from 'react'

const CompletedMessage:React.FC<{ onReturnClick(): void }> = ({ onReturnClick }) => (
    <Box direction="column" align="center">
        <h3>Thank you for completing the study</h3>
        <h5>your response has been recorded</h5>
        <Button primary data-test-id="view-studies" onClick={onReturnClick}>Return to dashboard</Button>
    </Box>
)


export default function UsersStudies() {
    const { params: { studyId } } = useRouteMatch<{ studyId: string }>();

    // this is somewhat inaccurate but we do not want to say something like "recording status"
    // since that will alarm participants who refused consent
    const [pendingMessage, setPendingMessage] = useState<ReactElement|null>(
        <LoadingAnimation message="Loading studies" />
    )
    const api = useStudyApi()
    const history = useHistory()
    const user = useCurrentUser()
    const noConsent = useQueryParam('consent') == 'true'

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
        if (isPreview) {
            setPendingMessage(null)
            return
        }
        const params:LandStudyRequest = { id: Number(studyId) }
        if (noConsent) {
            params['aborted'] = LandStudyAbortedEnum.Refusedconsent
        }

        api.landStudy(params)
           .then(() => {
               if (noConsent) {
                   onNav()
               } else {
                   setPendingMessage(null)
               }
           })
           .catch((err) => {
               setPendingMessage(<ErrorPage error={err?.statusText} />)
           })
    }, [])

    return (
        <div className="container studies mt-8">
            {pendingMessage || <CompletedMessage onReturnClick={onNav} />}
        </div>
    )

}
