import { React, useState, useCallback, useNavigate, useParams } from '@common'
import { ParticipantStudy, PublicResearcher } from '@api'
import { filter } from 'lodash-es'
import { LaunchStudy, isStudyLaunchable, StudyTopicID, StudyTopicTags, tagOfType, studyIsMultipart } from '@models'
import { useApi, dayjs } from '@lib'
import {
    OffCanvas, Icon, IconKey, Box, Button, SegmentedBar, Segment, SegmentCircle,
} from '@components'
import { colors } from '../../theme'

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
        <Box direction="column">
            <Box align='center' gap margin={{ vertical: 'default' }}>
                <Icon icon={icon} color={colors.purple} />
                <span css={{ color: colors.darkText }}>{title}</span>
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

    if (!isStudyLaunchable(study)) return null

    const onLaunch = useCallback(async () => {
        setBusy(true)
        await LaunchStudy(api, study)
        setBusy(false)
    }, [api, study, LaunchStudy, setBusy])
    if (study.completedAt) {
        return (
            <b>Completed on {dayjs(study.completedAt).format('LL')}</b>
        )
    }

    const action = (study.stages?.length && !study.stages[0].isCompleted) ? 'Begin' : 'Continue'
    return (
        <Button
            busy={isBusy}
            css={{ justifyContent: 'center' }}
            busyMessage="Launching Study…"
            primary
            data-test-id="launch-study"
            onClick={onLaunch}
        >
            {action} study
        </Button>
    )
}

const MultiSession: FC<StudyDetailsProps> = ({ study }) => {
    if (!study.stages || !studyIsMultipart(study)) return null

    const perc = filter(study.stages, 'isCompleted').length / study.stages.length

    const [first, last] = study.stages

    return (
        <Box align='center' justify="between" margin={{ bottom: 'large' }}>
            <Box align='center' gap>
                <Icon
                    icon="multiStage"
                    color={colors.purple}
                />
                <span css={{ color: colors.darkText }}>Multi-Session</span>
            </Box>
            <SegmentedBar completedPercentage={perc} css={{ margin: '0 20px' }}>
                <Segment key={1} percentage={0}>
                    <SegmentCircle achieved={first.isCompleted} />
                    <span>{first.title}</span>
                </Segment>
                <Segment key={2} percentage={50}>
                    <SegmentCircle
                        achieved={last.isCompleted}
                        current={first.isCompleted}
                        future={!first.isCompleted}
                        past={last.isCompleted}
                    />
                    <span>{last.availableAfterDays} days</span>
                </Segment>
                <Segment key={3} percentage={100}>
                    <SegmentCircle achieved={last.isCompleted} future={!last.isLaunchable} />
                    <span>{last.title}</span>
                </Segment>
            </SegmentedBar>
        </Box >
    )
}

const Researcher: React.FC<{ researcher?: PublicResearcher }> = ({ researcher }) => {
    if (!researcher) return null

    return (
        <Part icon="rolodex" title="About Researcher" >
            <Box direction="column">
                <Box gap>
                    <span>{researcher.name}</span>
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
    const studyId = Number(sid || '')
    const study = studies.find(s => s.id === studyId)
    const onHide = useCallback(() => nav('/studies'), [nav])

    if (!study) return null

    const topic = tagOfType<StudyTopicID>(study, 'topic')
    const tag = topic ? StudyTopicTags[topic] : ''

    return (
        <OffCanvas show={!!study} title="Study Detail" onHide={onHide}
            css={{ '&.offcanvas-end': { width: 500 }, '.offcanvas-header': { padding: '3rem 3rem 0 3rem' }, '.offcanvas-body': { padding: '3rem 3rem 3rem 3rem' } }}
        >
            <Box direction="column" flex>
                <div css={{ overflowY: 'auto', flex: 1 }}>
                    <h3>{study.title}</h3>
                    {tag && <Box gap align="center" margin={{ vertical: 'default' }}><Icon icon="feedback" color={colors.purple} />{tag}</Box>}
                    <Box gap align="center" margin={{ vertical: 'default' }}>
                        <Icon icon="clock" color={colors.purple} />
                        <div>{study.durationMinutes} min</div>
                        {study.participationPoints && <span> {study.participationPoints}pts</span>}
                    </Box>
                    <StudyPart property="feedbackDescription" title="Feedback Available" icon="feedback" study={study} />
                    <MultiSession study={study} />
                    <StudyPart property="benefits" title="What’s in it for you" icon="heart" study={study} />
                    <Part icon="warning" title="Notice">
                        Your responses to this study will be used to further learning science and
                        education research. All your data will be kept confidential and anonymous.
                    </Part>
                    <Researcher researcher={study.researchers?.[0]} />
                </div>
                <LaunchStudyButton study={study} />
            </Box>
        </OffCanvas>
    )
}
