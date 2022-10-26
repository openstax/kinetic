import { useNavigate, useParams } from 'react-router-dom'
import { React, useEffect, useState } from '@common'
import { colors } from '../theme'
import { ParticipantStudy, DefaultApi, LandStudyRequest, LandStudyAbortedEnum } from '@api'
import { Button, IncorrectUser, Box, LoadingAnimation, ErrorPage, KineticWaves } from '@components'
import { useQueryParam, useCurrentUser, useApi, isIframed, sendMessageToParent } from '@lib'

type LandedStudy = ParticipantStudy & { completedAt?: Date, abortedAt?: Date }

interface StudyMessagingProps {
    consented: boolean,
    aborted: boolean
    study: LandedStudy,

}

const Points: React.FC<StudyMessagingProps> = ({ study }) => {
    if (!study.completedAt) return null
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


const NonAbortedMessage: React.FC<StudyMessagingProps> = ({ study }) => {
    if (study.abortedAt) return null
    return (
        <div data-test-id="completed-msg">
            <h3>Success!</h3>
            <h5 css={{ lineHeight: '150%', marginBottom: '3rem' }}>
                You‘ve completed {!study.completedAt && 'stage of '} a Kinetic activity.
                {study.completedAt && ' This task will be marked as complete on your dashboard.'}
            </h5>
        </div>
    )
}

const AbortedMessage: React.FC<StudyMessagingProps> = ({ study }) => {
    if (!study.abortedAt) return null
    return (
        <div data-test-id="aborted-msg">
            <h3>Try again later!</h3>
            <h5 css={{ lineHeight: '150%', marginBottom: '3rem' }}>
                You can re-attempt the study later by selecting it from your dashboard.
            </h5>
        </div>
    )
}

const StudyMessaging: React.FC<StudyMessagingProps & { onReturnClick(): void }> = ({ onReturnClick, ...props }) => {
    return (
        <Box justify="center">
            <Box
                css={{
                    background: 'white',
                    border: `2px solid ${colors.lightGray}`,
                    maxWidth: '100%',
                }}
            >
                <Box
                    direction="column" padding="large"
                    margin={{ right: '-100px' }} align="start"
                    css={{
                        maxWidth: '400px',
                    }}
                >
                    <Points {...props} />
                    <AbortedMessage {...props} />
                    <NonAbortedMessage {...props} />
                    <Button primary data-test-id="view-studies" onClick={onReturnClick}>
                        Go back to dashboard
                    </Button>
                </Box>
                <KineticWaves flipped />
            </Box>
        </Box>
    )
}

const landStudy = async (api: DefaultApi, params: LandStudyRequest, isPreview: boolean): Promise<LandedStudy> => {
    const study = await api.getParticipantStudy({ id: params.id })
    if (isPreview) {
        return { ...study, completedAt: new Date() }
    }
    const landing = await api.landStudy(params)
    return { ...study, ...landing }
}

export default function UsersStudies() {
    const { studyId } = useParams<string>();

    // this is somewhat inaccurate but we do not want to say something like "recording status"
    // since that will alarm participants who refused consent
    const [study, setLanded] = useState<LandedStudy | null>(null)
    const [error, setError] = useState<any>(null)
    const api = useApi()
    const nav = useNavigate()
    const user = useCurrentUser()
    const noConsent = useQueryParam('consent') == 'false'
    const abort = useQueryParam('abort') == 'true'

    const md = useQueryParam('md') || {}
    if (!user) {
        return <IncorrectUser />
    }

    const onNav = () => {
        if (isIframed()) {
            sendMessageToParent({ closeStudyModal: true })
        } else {
            nav('/studies')
        }
    }
    useEffect(() => {
        let isPreview = false
        try {
            isPreview = Boolean(
                window.parent.document.querySelector('[data-is-study-preview-modal="true"]')
            )
        } catch { } // accessing window.parent my throw exception due to SOP
        const params: LandStudyRequest = {
            id: Number(studyId),
            md,
            consent: !noConsent,
        }
        if (abort) {
            params['aborted'] = LandStudyAbortedEnum.Refusedconsent
        }

        landStudy(api, params, isPreview)
            .then(setLanded)
            .catch(setError)
    }, [])

    if (error) {
        return <ErrorPage error={error} />
    }

    return (
        <div className="container studies mt-8">
            {!study && <LoadingAnimation message="Loading study" />}
            {study && <StudyMessaging aborted={abort} consented={!noConsent} onReturnClick={onNav} study={study} />}
        </div>
    )

}
