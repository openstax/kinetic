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
    isMultiSession,
    useFetchParticipantStudy,
} from '@models'
import { dayjs, useApi, useEnvironment } from '@lib'
import { Icon, MultiSessionBar } from '@components'
import { colors } from '@theme'
import { Button, Drawer, Group, Stack, Text } from '@mantine/core'
import { Navigate } from 'react-router-dom';
import { IconAlertTriangle, IconHeart, IconInfoCircle, IconMessageExclamation, IconUser } from '@tabler/icons-react';

interface StudyDetailsProps {
    study: ParticipantStudy
}

const LaunchStudyButton: FC<StudyDetailsProps> = ({ study }) => {
    const api = useApi()
    const env = useEnvironment()
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
    const action = (study.stages?.length && !!study.stages[0].completedAt) ? 'Begin' : 'Continue'
    return (
        <Button
            color='purple'
            loading={isBusy}
            data-analytics-select-content
            data-content-type="study-launch"
            data-content-tags={`,learning-path=${study.learningPath?.label},is-new-user=${env.isNewUser},`}
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

    if (isMultiSession(study)) {
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

    const { data: study, isLoading, isFetching } = useFetchParticipantStudy(studyId)

    useEffect(() => {
        if (study && !isFetching) {
            api.studyStats({
                id: study.id,
                view: true,
            })
        }
    }, [study])

    if (isLoading || isFetching) return null

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

    return (
        <Drawer.Root opened={show} onClose={onHide} position='right'>
            <Drawer.Overlay />
            <Drawer.Content>
                <Stack h='100%' p='md'>
                    <Stack>
                        <Group>
                            <Text span fw='bolder' size='xl'>{study.titleForParticipants}</Text>
                            <Drawer.CloseButton />
                        </Group>
                    </Stack>

                    <Stack gap='lg' style={{ flex: 1, overflow: 'auto' }}>
                        <StudyLearningPath study={study} />

                        <StudyTime study={study} />

                        <MultiSession study={study} />

                        <StudyDescription study={study} />

                        <ResearcherSection study={study} />

                        <StudyBenefits study={study} />

                        <DataNotice />
                    </Stack>

                    <Stack>
                        {!preview && <LaunchStudyButton study={study} />}
                    </Stack>
                </Stack>
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


const StudyLearningPath: FC<StudyDetailsProps> = ({ study }) => {
    if (!study.learningPath) return null

    return (
        <Group>
            <IconMessageExclamation size={16} color={colors.purple} />
            <Text>{study.learningPath.label}</Text>
            <Text size='sm'>{study.learningPath.description}</Text>
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
    if (!study.stages || !isMultiSession(study)) return null

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
