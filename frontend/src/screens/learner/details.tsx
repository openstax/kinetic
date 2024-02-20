import { React, useCallback, useEffect, useNavigate, useParams, useState } from '@common'
import { ParticipantStudy, PublicResearcher } from '@api'
import {
    getFirstStage,
    getStudyDuration,
    getStudyLead,
    getStudyPi,
    getStudyPoints,
    isStudyLaunchable,
    launchStudy,
    studyIsMultipart,
    useFetchParticipantStudy,
} from '@models'
import { dayjs, useApi } from '@lib'
import { Icon, MultiSessionBar } from '@components'
import { colors } from '@theme'
import { Box, Button, Drawer, Flex, Group, ScrollArea, Space, Stack, Text, Title } from '@mantine/core'
import { Navigate } from 'react-router-dom';
import { IconAlertTriangle, IconHeart, IconInfoCircle, IconMessageExclamation, IconUser } from '@tabler/icons-react';
import { useReactId } from '@mantine/hooks/lib/use-id/use-react-id';
import { useRef } from 'react'

interface StudyDetailsProps {
    study: ParticipantStudy
}

const LaunchStudyButton: FC<StudyDetailsProps> = ({ study }) => {
    const api = useApi()
    const [isBusy, setBusy] = useState(false)

    const onLaunch = async () => {
        setBusy(true)
        await launchStudy(api, study.id)
    }

    if (study.completedAt) {
        return (
            <Button color='purple' disabled>
                Completed on {dayjs(study.completedAt).format('LL')}
            </Button>
        )
    }
    const action = (study.stages?.length && !study.stages[0].isCompleted) ? 'Begin' : 'Continue'
    return (
        <Button
            color='purple'
            mt='auto'
            loading={isBusy}
            disabled={!isStudyLaunchable(study)}
            data-testid="launch-study"
            onClick={onLaunch}
        >
            {action} study
        </Button>
    )
}


const StudyTime: FC<StudyDetailsProps> = ({ study }) => {
    const firstStage = getFirstStage(study)
    if (!firstStage?.durationMinutes || !firstStage.points) return null

    if (studyIsMultipart(study)) {
        return (
            <Stack>
                <Group>
                    <Icon icon="clockOutline" color={colors.purple} />
                    <Group>
                        <span>*Total: {getStudyDuration(study)}min</span>
                        <span>&nbsp;&middot; {getStudyPoints(study)}pts</span>
                    </Group>
                </Group>
                <Stack c={colors.text}>
                    {study.stages?.map((stage, index) => (
                        <small key={index}>
                            Session {index + 1}: {stage.durationMinutes}min {stage.points}pts
                        </small>
                    ))}
                </Stack>
            </Stack>
        )
    }

    return (
        <Group align="center">
            <Icon icon="clockOutline" color={colors.purple} />
            <div>{firstStage.durationMinutes}min</div>
            <span>{firstStage.points}pts</span>
        </Group>
    )
}


export const StudyDetails: React.FC = () => {
    const { studyId: sid } = useParams<{ studyId: string }>()
    const nav = useNavigate()
    const api = useApi()
    const studyId = Number(sid || '')
    const onHide = useCallback(() => nav('/studies'), [nav])

    const { data: study, isLoading } = useFetchParticipantStudy(studyId)

    useEffect(() => {
        if (study) {
            api.studyStats({
                id: study.id,
                view: true,
            })
        }
    }, [study])

    if (isLoading) return null

    if (!study) return <Navigate to="/studies" />

    return (
        <StudyDetailsPreview study={study} show={!!study} onHide={onHide} />
    )
}

export const StudyDetailsPreview: FC<{
    study: ParticipantStudy,
    show: boolean,
    onHide: () => void,
    preview?: boolean
}> = ({ study, show, onHide, preview = false }) => {
    const drawerHeaderRef = useRef<HTMLDivElement>(null)
    const drawerBodyRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        drawerBodyRef.current.style.height = 'calc'
    }, [drawerHeaderRef])
    return (
        <Drawer.Root opened={show} onClose={onHide} position='right'>
            <Drawer.Overlay />
            <Drawer.Content>
                <Drawer.Header ref={drawerHeaderRef}>
                    <Drawer.Title>
                        <Text span fw='bolder' size='xl'>{study.titleForParticipants}</Text>
                    </Drawer.Title>
                    <Drawer.CloseButton />
                </Drawer.Header>
                <Drawer.Body ref={drawerBodyRef}>
                    <Stack gap='lg' h='100%'>
                        <StudyTopic study={study} />

                        <StudyTime study={study} />

                        <MultiSession study={study} />

                        <StudyDescription study={study} />

                        <ResearcherSection study={study} />

                        <StudyBenefits study={study} />

                        <DataNotice />

                        {!preview && <LaunchStudyButton study={study} />}
                    </Stack>
                </Drawer.Body>
            </Drawer.Content>
        </Drawer.Root>
    )
}

const StudyDescription: FC<StudyDetailsProps> = ({ study }) => {
    if (!study.longDescription) return null

    return (
        <Stack gap='xs'>
            <Group>
                <IconInfoCircle size={16} color={colors.purple} />
                <Text>About this study</Text>
            </Group>

            <Text>{study.longDescription}</Text>
        </Stack>
    )
}


const StudyTopic: FC<StudyDetailsProps> = ({ study }) => {
    if (!study.topic) return null

    return (
        <Group>
            <IconMessageExclamation size={16} color={colors.purple} />
            <Text>{study.topic}</Text>
        </Group>
    )
}

const StudyBenefits: FC<StudyDetailsProps> = ({ study }) => {
    if (!study.benefits) return null

    return (
        <Stack gap='xs'>
            <Group>
                <IconHeart size={16} color={colors.purple} fill={colors.purple}/>
                <Text>What's in it for you</Text>
            </Group>

            <Text>{study.benefits}</Text>
        </Stack>
    )
}

const DataNotice: FC = () => {
    return (
        <Stack gap='xs'>
            <Group>
                <IconAlertTriangle size={16} color={colors.purple} />
                <Text>Notice</Text>
            </Group>

            <Text>Your responses to this study will be used to further learning science and education research. All your data will be kept confidential and anonymous.</Text>
        </Stack>
    )
}

const Researcher: React.FC<{ researcher?: PublicResearcher }> = ({ researcher }) => {
    if (!researcher || !researcher.firstName || !researcher.lastName) return null

    return (
        <Stack gap='xs'>
            <Group>
                <IconUser size={16} color={colors.purple} fill={colors.purple}/>
                <Text span>About {researcher.role == 'pi' ? 'Principal Investigator' : 'Study Lead'}</Text>
            </Group>
            <Stack gap='xs'>
                <Text span>Name: {researcher.firstName} {researcher.lastName}</Text>
                <Text span>Institution: {researcher.institution}</Text>
                <Text>Bio: {researcher.bio}</Text>
            </Stack>
        </Stack>
    )
}

const ResearcherSection: FC<StudyDetailsProps> = ({ study }) => {
    const pi = getStudyPi(study)
    const lead = getStudyLead(study)

    if (pi && lead && pi.id === lead.id) {
        return <Researcher researcher={pi} />;
    }

    return (
        <>
            {pi && <Researcher researcher={pi} />}
            {lead && <Researcher researcher={lead} />}
        </>
    )
}

const MultiSession: FC<StudyDetailsProps> = ({ study }) => {
    if (!study.stages || !studyIsMultipart(study)) return null

    return (
        <Stack>
            <Group>
                <Icon
                    icon="cardMultiple"
                    color={colors.purple}
                />
                <span>Multi-Session</span>
            </Group>
            <MultiSessionBar study={study} />
        </Stack >
    )
}
