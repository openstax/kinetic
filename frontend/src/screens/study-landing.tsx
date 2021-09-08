
import { useHistory, useRouteMatch } from 'react-router-dom'
import { React } from '@common'
import { Button, IncorrectUser, Box } from '@components'
import { useCurrentUser, useStudyApi, isIframed, sendMessageToParent } from '@lib'
import { useEffect } from 'react'


export default function UsersStudies() {
    const { params: { studyId } } = useRouteMatch<{ studyId: string }>();
    const api = useStudyApi()
    const history = useHistory()
    const user = useCurrentUser()

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

    return (

        <div className="container studies mt-8">
            <Box direction="column" align="center">
                <h3>Thank you for completing the study</h3>
                <h5>your response has been recorded</h5>
                <Button primary onClick={onNav}>Return to view other studies</Button>
            </Box>
        </div>
    )

}
