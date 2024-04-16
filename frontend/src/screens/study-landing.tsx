import { Navigate, NavLink, useParams } from 'react-router-dom'
import { React, useEffect, useState } from '@common'
import { colors } from '@theme'
import { LandStudyAbortedEnum, LandStudyRequest, LearningPath, ParticipantStudy } from '@api'
import { ErrorPage, LoadingAnimation, Page } from '@components'
import { useCurrentUser, useEnvironment, useIsMobileDevice, useQueryParam } from '@lib'
import { Anchor, Container, Flex, Grid, Group, Image, ScrollArea, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useLandStudy, useLearningPathStudies } from './learner/studies';
import { CompactStudyCard } from '../components/study/compact-study-card';

export default function StudyLanding() {
    const { studyId } = useParams<string>();
    const [study, setStudy] = useState<ParticipantStudy | null>(null)
    const env = useEnvironment()

    const [error, setError] = useState<any>(null)
    const consent = useQueryParam('consent') != 'false'
    const abort = useQueryParam('abort') == 'true'
    const md = useQueryParam('md') || {}
    const landStudy = useLandStudy()
    const learningPathStudies = useLearningPathStudies(study?.learningPath)

    useEffect(() => {
        const params: LandStudyRequest = {
            id: Number(studyId),
            md,
            consent: consent,
        }
        if (abort) {
            params['aborted'] = LandStudyAbortedEnum.Refusedconsent
        }

        landStudy.mutate(params, {
            onSuccess: setStudy,
            onError: setError,
        })
    }, [])

    // Learners who don't consent won't earn points, so we'll just redirect them home
    if (!consent) {
        return <Navigate to='/studies' />
    }

    if (!study || !study.learningPath) {
        return  <LoadingAnimation message="Loading" />
    }

    if (error) {
        return <ErrorPage error={error} />
    }

    return (
        <Page hideFooter
            data-analytics-view
            data-analytics-nudge="study-complete"
            data-content-tags={`,learning-path=${study.learningPath.label},is-new-user=${env.isNewUser},`}
        >
            {study.learningPath?.completed ?
                <CompletedLearningPath learningPath={study.learningPath} /> :
                <LearningPathProgress learningPath={study.learningPath} studies={learningPathStudies} />
            }
        </Page>
    )
}

const LearningPathProgress: FC<{learningPath: LearningPath, studies: ParticipantStudy[]}> = ({ learningPath, studies }) => {
    const isMobile = useIsMobileDevice()

    return (
        <Stack gap='xl'>
            <Title order={1} c='purple'>
                You’re one step closer to earning a badge
            </Title>

            {isMobile ?
                <ScrollArea h={275}>
                    <Flex justify='center' align='center'>
                        <Group mt='lg' wrap='nowrap'>
                            {studies.map(study => (
                                <CompactStudyCard study={study} key={study.titleForParticipants} />
                            ))}
                            <Image h={200} w={200} src={learningPath.badge?.image} />
                        </Group>
                    </Flex>
                </ScrollArea>
                : <Container>
                    <SimpleGrid cols={{ base: 1, lg: 3  }} spacing='xl' verticalSpacing='xl'>
                        {studies.map(study => (
                            <CompactStudyCard study={study} key={study.titleForParticipants} />
                        ))}
                        <Image h={200} w={200} src={learningPath.badge?.image} />
                    </SimpleGrid>
                </Container>
            }
        </Stack>
    )
}

const CompletedLearningPath: FC<{learningPath: LearningPath}> = ({ learningPath }) => {
    const user = useCurrentUser()
    const email = user.contactInfos?.find(e => e.type == 'EmailAddress')

    return (
        <Grid justify='space-around' align='center'>
            <Grid.Col span={2}>
                <Image fit='contain' h={250} w={250} src={learningPath.badge?.image} />
            </Grid.Col>
            <Grid.Col span={6}>
                <Stack>
                    <Title order={1} c='purple'>
                        Wow, effort really pays off!
                    </Title>
                    <Title order={5} c={colors.text}>
                        You’ve done an awesome job so far!
                    </Title>
                    <Text c={colors.gray70}>
                        We recognize all that you’ve accomplished and we want to ensure others see it too. Your certificate is on its way and should be in your inbox soon. Know that your contributions have been crucial to help change the future of education.
                    </Text>
                    <Stack>
                        <Title order={5} c={colors.text}>
                            You’ve done an awesome job so far!
                        </Title>
                        <Text c={colors.gray70}>
                            Mail sent to {email?.value} <NavLink to="/account">Change email</NavLink>
                        </Text>
                    </Stack>
                </Stack>

            </Grid.Col>
        </Grid>
    )
}
