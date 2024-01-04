import { Navigate, NavLink, useParams } from 'react-router-dom'
import { React, useEffect, useState } from '@common'
import { colors } from '@theme'
import { DefaultApi, LandStudyAbortedEnum, LandStudyRequest, ParticipantStudy } from '@api'
import { ErrorPage, LoadingAnimation } from '@components'
import { useApi, useQueryParam } from '@lib'
import { BackgroundImage, Button, Container, Flex, Modal, SimpleGrid, Space, Stack, Text, Title } from '@mantine/core';
import Waves from '@images/waves.svg'
import { launchStudy, RewardsSegment, useRewardsSchedule } from '@models';
import { useLearnerStudies } from './learner/studies';
import dayjs from 'dayjs';
import { noop } from 'lodash-es';

type LandedStudy = ParticipantStudy & { completedAt?: Date, abortedAt?: Date }

const Points: React.FC<{ study: LandedStudy }> = ({ study }) => {
    const completed = study.stages?.find(stage => stage.isCompleted) || study.completedAt
    if (!completed) return null

    return (
        <Title order={2} c='white'>
            You just earned {study.totalPoints} points!
        </Title>
    )
}

const landStudy = async (api: DefaultApi, params: LandStudyRequest): Promise<LandedStudy> => {
    const study = await api.getParticipantStudy({ id: params.id })
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
        const params: LandStudyRequest = {
            id: Number(studyId),
            md,
            consent: consent,
        }
        if (abort) {
            params['aborted'] = LandStudyAbortedEnum.Refusedconsent
        }

        landStudy(api, params)
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
            <Modal opened={true} onClose={noop} centered size='75%' closeOnClickOutside={false} closeOnEscape={false} withCloseButton={false} styles={{
                body: {
                    padding: 0,
                },
            }}>
                <BackgroundImage src={Waves}>
                    <Stack gap='xl' p='xl' c='white'>
                        <NavLink to={'/studies'} style={{ alignSelf: 'end', color: 'white', fontWeight: 'bolder' }} data-testid='view-studies'>
                            Return to Dashboard
                        </NavLink>
                        <Points study={study} />
                        <Text size='xl' pt='xl'>
                            You’re one step closer - don’t miss out on the chance to qualify for the next reward cycle!
                        </Text>
                        <NextPrizeCycle nextReward={nextReward} />
                        <CompleteProfilePrompt demographicSurvey={demographicSurvey} />
                        <Space h='xl' />
                        <Space h='xl' />
                    </Stack>
                </BackgroundImage>
            </Modal>
        </Container>
    )
}

const NextPrizeCycle: FC<{ nextReward: RewardsSegment | undefined } > = ({ nextReward }) => {
    if (!nextReward) return null

    return (
        <Flex direction='column'>
            <Text size='xl' fw='bolder'>Next Prize Cycle:</Text>
            <Text size='xl'>Reach {nextReward?.points} points by {dayjs(nextReward.endAt).format('MMM D')} and be one of the lucky winners to earn {nextReward.prize}</Text>
        </Flex>
    )
}

const CompleteProfilePrompt: FC<{demographicSurvey: ParticipantStudy | null}> = ({ demographicSurvey }) => {
    const api = useApi()
    if (!demographicSurvey || !!demographicSurvey.completedAt) return null

    const onClick = async () => {
        await launchStudy(api, demographicSurvey.id)
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
