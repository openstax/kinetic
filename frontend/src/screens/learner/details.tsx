import { React, useCallback, useEffect, useNavigate, useParams, useState } from '@common'
import { ParticipantStudy, PublicResearcher } from '@api'
import { isStudyLaunchable, LaunchStudy, studyIsMultipart } from '@models'
import { dayjs, useApi } from '@lib'
import { Box, Button, Icon, IconKey, MultiSessionBar, OffCanvas } from '@components'
import { colors } from '@theme'

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
            <div css={{ marginBottom: '0.5rem', color: colors.grayText }}>{children}</div>
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
    const api = useApi()
    const [isBusy, setBusy] = useState(false)

    const onLaunch = useCallback(async () => {
        setBusy(true)
        await LaunchStudy(api, study)
        setBusy(false)
    }, [api, study, LaunchStudy, setBusy])

    if (study.completedAt) {
        return (
            <Button primary disabled>Completed on {dayjs(study.completedAt).format('LL')}</Button>
        )
    }
    const action = (study.stages?.length && !study.stages[0].isCompleted) ? 'Begin' : 'Continue'
    return (
        <Button
            busy={isBusy}
            css={{ justifyContent: 'center' }}
            busyMessage="Launching Study…"
            primary
            disabled={!isStudyLaunchable(study)}
            data-testid="launch-study"
            onClick={onLaunch}
        >
            {action} study
        </Button>
    )
}


const MultiSession: FC<StudyDetailsProps> = ({ study }) => {
    if (!study.stages || !studyIsMultipart(study)) return null

    return (
        <Box direction="column" margin={{ bottom: 'large' }}>
            <Box align='center' gap>
                <Icon
                    icon="multiStage"
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
    if (studyIsMultipart(study)) {
        return (
            <Box className='mb-1' direction='column'>
                <Box gap>
                    <Icon icon="clock" color={colors.purple} />
                    <Box>
                        <span>*Total: {study.totalDuration}min</span>
                        {study.totalPoints && <span>&nbsp;&middot; {study.totalPoints}pts</span>}
                    </Box>
                </Box>
                <Box css={{ color: colors.grayText }} direction='column'>
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
            <Icon icon="clock" color={colors.purple} />
            <div>{study.totalDuration}min</div>
            {!!study.totalPoints && <span>{study.totalPoints}pts</span>}
        </Box>
    )
}


const Researcher: React.FC<{ researcher?: PublicResearcher }> = ({ researcher }) => {
    if (!researcher || !researcher.firstName || !researcher.lastName) return null

    return (
        <Part icon="rolodex" title="About Researcher" >
            <Box direction="column">
                <Box gap>
                    <span>{researcher.firstName} {researcher.lastName}</span>
                    <span>{researcher.institution}</span>
                </Box>
                <p>{researcher.bio}</p>
            </Box>
        </Part>
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
                    {study.studyTopic && <Box gap align="center" margin={{ vertical: 'large' }}>
                        <div css={{ position: 'relative' }}>
                            <Icon icon="chatLeft" color={colors.purple} />
                            <span css={{
                                position: 'absolute',
                                left: 6,
                                top: 6,
                                color: 'white',
                                fontSize: 7,
                            }}>#</span>
                        </div>
                        {study.studyTopic}</Box>
                    }
                    <StudyTime study={study} />
                    <StudyPart property="feedbackDescription" title="Feedback Available" icon="feedback" study={study} />
                    <MultiSession study={study} />
                    <Box margin={{ bottom: 'large' }} css={{ color: colors.grayText }}>{study.longDescription}</Box>
                    <Researcher researcher={study.researchers?.[0]} />
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
