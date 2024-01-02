import { React, useCallback, useEffect, useNavigate, useParams } from '@common'
import { ParticipantStudy, PublicResearcher } from '@api'
import {
    getFirstStage,
    getStudyDuration,
    getStudyLead,
    getStudyPi,
    getStudyPoints,
    isStudyLaunchable,
    studyIsMultipart,
    useLaunchStudyUrl,
} from '@models'
import { dayjs, useApi } from '@lib'
import { Box, Icon, IconKey, MultiSessionBar, OffCanvas } from '@components'
import { colors } from '@theme'
import { Anchor, Button } from '@mantine/core'

interface StudyDetailsProps {
    study: ParticipantStudy
}

const Part: FCWC<{ title: string, icon: IconKey }> = ({
    children,
    title,
    icon,
}) => {
    if (!children) return null
    return (
        <Box direction="column" margin={{ bottom: 'large' }}>
            <Box align='center' gap margin={{ vertical: 'default' }}>
                <Icon icon={icon} color={colors.purple} />
                <span>{title}</span>
            </Box>
            <div css={{ marginBottom: '0.5rem', color: colors.text }}>{children}</div>
        </Box>
    )
}

const StudyPart: FC<StudyDetailsProps & { title: string, icon: IconKey, property: string }> = ({
    icon,
    study,
    title,
    property,
}) => {
    const s = study as any
    if (!s[property]) return null

    return (
        <Part title={title} icon={icon}>
            {s[property]}
        </Part>
    )
}

const LaunchStudyButton: FC<StudyDetailsProps> = ({ study }) => {
    const launchUrl = useLaunchStudyUrl(study.id)

    if (!launchUrl) return null

    if (study.completedAt) {
        return (
            <Button color='purple' disabled>
                Completed on {dayjs(study.completedAt).format('LL')}
            </Button>
        )
    }
    const action = (study.stages?.length && !study.stages[0].isCompleted) ? 'Begin' : 'Continue'

    return (
        <Anchor href={launchUrl} target='_blank'>
            <Button
                color='purple'
                w='100%'
                disabled={!isStudyLaunchable(study)}
                data-testid="launch-study"
            >
                {action} study
            </Button>
        </Anchor>
    )
}


const MultiSession: FC<StudyDetailsProps> = ({ study }) => {
    if (!study.stages || !studyIsMultipart(study)) return null

    return (
        <Box direction="column" margin={{ bottom: 'large' }}>
            <Box align='center' gap>
                <Icon
                    icon="cardMultiple"
                    color={colors.purple}
                />
                <span>Multi-Session</span>
            </Box>
            <Box margin={{ vertical: 'large' }}>
                <MultiSessionBar study={study} />
            </Box>
        </Box >
    )
}

const StudyTime: FC<StudyDetailsProps> = ({ study }) => {
    const firstStage = getFirstStage(study)
    if (!firstStage?.durationMinutes || !firstStage.points) return null

    if (studyIsMultipart(study)) {
        return (
            <Box className='mb-1' direction='column'>
                <Box gap>
                    <Icon icon="clockOutline" color={colors.purple} />
                    <Box>
                        <span>*Total: {getStudyDuration(study)}min</span>
                        <span>&nbsp;&middot; {getStudyPoints(study)}pts</span>
                    </Box>
                </Box>
                <Box css={{ color: colors.text }} direction='column'>
                    {study.stages?.map((stage, index) => (
                        <small key={index}>
                            Session {index + 1}: {stage.durationMinutes}min {stage.points}pts
                        </small>
                    ))}
                </Box>
            </Box>
        )
    }

    return (
        <Box gap align="center" className='mb-1'>
            <Icon icon="clockOutline" color={colors.purple} />
            <div>{firstStage.durationMinutes}min</div>
            <span>{firstStage.points}pts</span>
        </Box>
    )
}


const Researcher: React.FC<{ researcher?: PublicResearcher }> = ({ researcher }) => {
    if (!researcher || !researcher.firstName || !researcher.lastName) return null

    return (
        <Part icon="person" title="About Researcher">
            <Box direction="column">
                <Box gap>
                    Name:
                    <span>{researcher.firstName} {researcher.lastName}</span>
                </Box>
                <Box gap>
                    Institution:
                    <span>{researcher.institution}</span>
                </Box>
                <Box gap>
                    Bio:
                    <p>{researcher.bio}</p>
                </Box>
            </Box>
        </Part>
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

export const StudyDetails: React.FC<{ studies: ParticipantStudy[] }> = ({ studies }) => {
    const { studyId: sid } = useParams<{ studyId: string }>()
    const nav = useNavigate()
    const api = useApi()
    const studyId = Number(sid || '')
    const study = studies.find(s => s.id === studyId)
    const onHide = useCallback(() => nav('/studies'), [nav])

    useEffect(() => {
        if (study) {
            api.studyStats({
                id: study.id,
                view: true,
            })
        }
    }, [study])

    if (!study) return null

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
        <OffCanvas show={show} title="Study Detail" onHide={onHide}>
            <Box direction="column" flex>
                <div css={{ overflowY: 'auto', flex: 1 }}>
                    <h3>{study.titleForParticipants}</h3>
                    {study.topic && <Box gap align="center" margin={{ vertical: 'large' }}>
                        <div css={{ position: 'relative' }}>
                            <Icon icon="message" color={colors.purple} />
                            <span css={{
                                position: 'absolute',
                                left: 6,
                                top: 6,
                                color: 'white',
                                fontSize: 7,
                            }}>#</span>
                        </div>
                        {study.topic}
                    </Box>}
                    <StudyTime study={study} />
                    <StudyPart property="feedbackDescription" title="Feedback Available" icon="feedback" study={study} />
                    <MultiSession study={study} />
                    <Box margin={{ bottom: 'large' }} css={{ color: colors.text }}>{study.longDescription}</Box>
                    <ResearcherSection study={study} />
                    <StudyPart property="benefits" title="What’s in it for you" icon="heart" study={study} />
                    <Part icon="warning" title="Notice">
                        Your responses to this study will be used to further learning science and
                        education research. All your data will be kept confidential and anonymous.
                    </Part>
                </div>
                {!preview && <LaunchStudyButton study={study} />}
            </Box>
        </OffCanvas>
    )
}
