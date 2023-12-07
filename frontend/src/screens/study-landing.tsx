import { Navigate, NavLink, useParams } from 'react-router-dom'
import { React, useEffect, useState } from '@common'
import { colors } from '@theme'
import { DefaultApi, LandStudyAbortedEnum, LandStudyRequest, ParticipantStudy } from '@api'
import { ErrorPage, LoadingAnimation } from '@components'
import { useApi, useQueryParam } from '@lib'
import { BackgroundImage, Button, Container, Flex, Modal, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import Waves from '@images/waves.svg'
import { LaunchStudy, RewardsSegment, useRewardsSchedule } from '@models';
import { useLearnerStudies } from './learner/studies';
import dayjs from 'dayjs';
import { noop } from 'lodash-es';

type LandedStudy = ParticipantStudy & { completedAt?: Date, abortedAt?: Date }

const Points: React.FC<{ study: LandedStudy }> = ({ study }) => {
    const completedStage = study.stages?.find(stage => stage.isCompleted)
    if (!completedStage) return null

    return (
        <Title order={2} c='white'>
            You just earned {study.totalPoints} points!
        </Title>
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

export default function StudyLanding() {
    const { studyId } = useParams<string>();

    // this is somewhat inaccurate but we do not want to say something like "recording status"
    // since that will alarm participants who refused consent
    const [study, setLanded] = useState<LandedStudy | null>(null)
    const [error, setError] = useState<any>(null)
    const api = useApi()
    const consent = useQueryParam('consent') != 'false'
    const abort = useQueryParam('abort') == 'true'
    const md = useQueryParam('md') || {}
    const { allStudies, demographicSurvey } = useLearnerStudies()
    const { schedule } = useRewardsSchedule(allStudies)
    const nextReward = schedule.find(rewardSegment => !rewardSegment.achieved)

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
            consent: consent,
        }
        if (abort) {
            params['aborted'] = LandStudyAbortedEnum.Refusedconsent
        }

        landStudy(api, params, isPreview)
            .then(setLanded)
            .catch(setError)
    }, [])

    // Learners who don't consent won't earn points, so we'll just redirect them home
    if (!consent) {
        return <Navigate to='/studies' />
    }

    if (!study) {
        return  <LoadingAnimation message="Loading study" />
    }

    if (error) {
        return <ErrorPage error={error} />
    }

    return (
        <Container>
            <Modal opened={true} onClose={noop} centered size='xl' closeOnClickOutside={false} closeOnEscape={false} withCloseButton={false} styles={{
                body: {
                    padding: 0,
                },
            }}>
                <BackgroundImage src={Waves}>
                    <Stack gap='xl' p='xl' c='white'>
                        <NavLink to={'/studies'} style={{ alignSelf: 'end', color: 'white' }} data-testid='view-studies'>
                            Return to Dashboard
                        </NavLink>
                        <Points study={study} />
                        <Text>
                            You’re one step closer - don’t miss out on the chance to qualify for the next reward cycle!
                        </Text>
                        <NextPrizeCycle nextReward={nextReward} />
                        <CompleteProfilePrompt demographicSurvey={demographicSurvey} />
                    </Stack>
                </BackgroundImage>
            </Modal>
        </Container>
    )
}

const NextPrizeCycle: FC<{ nextReward: RewardsSegment | undefined } > = ({ nextReward }) => {
    if (!nextReward) return null
    // TODO Questions:
    // 1. Should we show total points? - Show stages' individual points, don't show points if no consent
    // 2. If user has already reached next prize cycle's points, what do we want to show?
    // 4. Aborted: Confirm its not being used / not possible to reach the state?
    return (
        <Flex direction='column'>
            <Text fw='bolder'>Next Prize Cycle:</Text>
            <Text>Reach {nextReward?.points} points by {dayjs(nextReward.endAt).format('MMM D')} and be one of the lucky winners to earn {nextReward.prize}</Text>
        </Flex>
    )
}

const CompleteProfilePrompt: FC<{demographicSurvey: ParticipantStudy | null}> = ({ demographicSurvey }) => {
    const api = useApi()
    if (!demographicSurvey) return null

    const onClick = async () => {
        await LaunchStudy(api, demographicSurvey.id)
    }

    return (
        <SimpleGrid cols={2} bg={`${colors.gray10}10`} p='lg'>
            <Stack>
                <Text>
                    <strong>Bonus: </strong>
                    <span>Get {demographicSurvey?.totalPoints} points now by simply taking {demographicSurvey?.totalDuration} minutes to complete your Kinetic Profile!</span>
                </Text>
            </Stack>
            <Button color='blue' c='white' onClick={onClick}>
                Finish Profile for 10 points
            </Button>
        </SimpleGrid>
    )
}
