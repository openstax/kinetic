import { useHistory, useRouteMatch } from 'react-router-dom'
import { React, useEffect, useState } from '@common'
import { colors } from '../theme'
import { ParticipantStudy, LandStudyAbortedEnum, LandStudyRequest, StudiesApi } from '@api'
import { Button, IncorrectUser, Box, LoadingAnimation, ErrorPage, KineticWaves } from '@components'
import { useQueryParam, useCurrentUser, useStudyApi, isIframed, sendMessageToParent } from '@lib'


const Points:React.FC<{ study: ParticipantStudy }> = ({ study }) => {
    return (
        <div
            css={{
                fontSize: '28px',
                fontWeight: 300,
                color: colors.purple,
            }}

        >
            +{study.participationPoints}pts
        </div>
    )
}

const CompletedMessage:React.FC<{
    consented: boolean,
    study: ParticipantStudy,
    onReturnClick(): void,
}> = ({
    consented, study, onReturnClick,
}) => (
    <Box justify="center">
        <Box
            css={{
                background: 'white',
                border: `2px solid ${colors.lightGray}`,
            }}
        >
            <Box
                direction="column" pad="large"
                margin={{ right: '-100px' }} align="start"
                css={{
                    maxWidth: '400px',
                }}
            >
                {!consented && <Points study={study} />}
                <h3>Success!</h3>
                <h5 css={{ lineHeight: '150%', marginBottom: '3rem' }}>
                    You‘ve completed a Kinetic activity.
                    This task will be marked as complete on your dashboard.
                </h5>
                <Button primary data-test-id="view-studies" onClick={onReturnClick}>Go back to dashboard</Button>

            </Box>
            <KineticWaves flipped />
        </Box>
    </Box>
)

const landStudy = async (api: StudiesApi, params: LandStudyRequest, isPreview: boolean) => {
    const study = await api.getParticipantStudy({ id: params.id })
    if (!isPreview) {
        await api.landStudy(params)
    }
    return study
}

export default function UsersStudies() {
    const { params: { studyId } } = useRouteMatch<{ studyId: string }>();

    // this is somewhat inaccurate but we do not want to say something like "recording status"
    // since that will alarm participants who refused consent
    const [study, setStudy] = useState<ParticipantStudy|null>(null)
    const [error, setError] = useState<any>(null)
    const api = useStudyApi()
    const history = useHistory()
    const user = useCurrentUser()
    const noConsent = useQueryParam('consent') == 'false'
    const metadata = useQueryParam('metadata') || {}
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
        } catch { } // accessing window.parent my throw exception due to SOP
        const params:LandStudyRequest = {
            id: Number(studyId),
            metadata,
        }
        if (noConsent) {
            params['aborted'] = LandStudyAbortedEnum.Refusedconsent
        }

        landStudy(api, params, isPreview)
            .then(setStudy)
            .catch(setError)
    }, [])

    if (error) {
        return <ErrorPage error={error} />
    }

    return (
        <div className="container studies mt-8">
            {!study && <LoadingAnimation message="Loading study" />}
            {study && <CompletedMessage consented={!noConsent} onReturnClick={onNav} study={study} />}
        </div>
    )

}
