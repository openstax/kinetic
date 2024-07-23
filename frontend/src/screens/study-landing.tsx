import { Navigate, NavLink, useLoaderData } from 'react-router-dom'
import { React, useRef, useEffect } from '@common'
import { colors } from '@theme'
import { LearningPath, ParticipantStudy } from '@api'
import { Page } from '@components'
import { useCurrentUser, useEnvironment, useIsMobileDevice } from '@lib'
import {
    Badge,
    Card,
    Container,
    Flex,
    Grid,
    Group,
    Image,
    ScrollArea,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react'
import Markdown from 'react-markdown'
import { useLearningPathStudies } from './learner/studies';
import { CompactStudyCard } from '../components/study/compact-study-card';
import { notifications } from '@mantine/notifications';

export default function StudyLanding() {
    const env = useEnvironment()
    const study = useLoaderData() as ParticipantStudy
    const learningPathStudies = useLearningPathStudies(study?.learningPath)
    const notificationShown = useRef(false)


    const showEarnedPointsNotification = (points: number) => {
        notifications.show({
            title: `You just earned ${points} points!`,
            message: 'The longer the study, the more points you earn. Reach 200 points to unlock additional rewards.',
            icon: <IconCheck size="1.1rem" />,
            color: 'teal',
            autoClose: 5000, 
            styles: () => ({
                description: { fontSize: '12px' },
            }),
        });
    };

    useEffect(() => {
        if (study.totalPoints > 0 && !notificationShown.current) {
            showEarnedPointsNotification(study.totalPoints);
            notificationShown.current = true;
        }
    }, [study.totalPoints]);

    if (!study || !study.learningPath) {
        return <Navigate to='/studies' />
    }


    return (
        <Page hideFooter
            data-analytics-view
            data-analytics-nudge="study-complete"
            data-content-tags={`,learning-path=${study.learningPath.label},is-new-user=${env.isNewUser},`}
        >
            <Card p={{ lg: 'xl' }} m={{ lg: 'xl' }} shadow='md' radius='md'>
                {study.learningPath?.completed ?
                    <CompletedLearningPath learningPath={study.learningPath} /> :
                    <LearningPathProgress learningPath={study.learningPath} studies={learningPathStudies} />
                }
            </Card>

        </Page>
    )
}

const LearningPathProgress: FC<{learningPath: LearningPath, studies: ParticipantStudy[]}> = ({ learningPath, studies }) => {
    const isMobile = useIsMobileDevice()
    return (
        <Stack gap='xl'>
            <Title order={1} c='purple'>
                One step closer to earning your badge!
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
                    <SimpleGrid cols={{ sm: 2, lg: 3  }} spacing='xl' verticalSpacing='xl'>
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
    const badge = learningPath.badge

    if (!badge) return null

    return (
        <Grid justify='space-around' align='center'>
            <Grid.Col span={2}>
                <Image fit='contain' h={250} w={250} src={learningPath.badge?.image} />
            </Grid.Col>
            <Grid.Col span={7}>
                <Stack>
                    <Title order={1} c='purple'>
                        Wow, effort really pays off!
                    </Title>

                    <Stack gap='0'>
                        <Title order={5} c='purple'>
                            You’ve done awesome work so far!
                        </Title>
                        <Text c={colors.gray70}>
                            {badge.description}
                        </Text>
                        <Group>
                            {badge.tags?.map(tag => (
                                <Badge key={tag}>{tag.toUpperCase()}</Badge>
                            ))}
                        </Group>
                    </Stack>

                    <Stack gap='0'>
                        <Title order={5} c='purple'>
                            Criteria
                        </Title>
                        <Markdown css={{ color: colors.gray70 }}>
                            {badge.criteriaHtml}
                        </Markdown>
                    </Stack>

                    <Stack gap='0'>
                        <Title order={5} c='purple'>
                            Your certificate is on its way and should be in your inbox soon.
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
