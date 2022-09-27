import { React, useEffect, useState, useMemo, useCallback, cx } from '@common'
import { ParticipantStudy } from '@api'
import styled from '@emotion/styled'
import { colors, media } from '../theme'
import { tagOfType } from '@models'
import { Global } from '@emotion/react'
import { sampleSize, sortBy, groupBy } from 'lodash'
import {
    Box, RewardsProgressBar, TopNavBar, Footer,
} from '@components'
import { useApi, useIsMobileDevice } from '@lib'
import {
    isStudyLaunchable, StudyTopicTags, studyTopicTagIDs, StudyTopicID,
} from '@models'
import { StudyCard } from './learner/card'
import { SplashImage } from './learner/splash-image'
import { StudyModal } from './studies/modal'
import { StudyDetails } from './learner/details'
import { Route, Routes, useNavigate } from 'react-router-dom'

const Splash = styled(Box)({
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
})

type StudyByTopics = Record<StudyTopicID, ParticipantStudy[]>

interface StudyState {
    mandatoryStudy?: ParticipantStudy
    allStudies: ParticipantStudy[]
    highlightedStudies: ParticipantStudy[]
    studiesByTopic: StudyByTopics
}

const useParticpantStudies = () => {
    const api = useApi()
    const [filter, setFilter] = useState<StudyTopicID>('topic:personality')
    const [studies, setStudyState] = useState<StudyState>({
        allStudies: [],
        highlightedStudies: [],
        studiesByTopic: {} as StudyByTopics,
    })

    const fetchStudies = useCallback(async () => {
        const fetchedStudies = await api.getParticipantStudies()
        const mandatoryStudy = fetchedStudies.data?.find(s => isStudyLaunchable(s) && s.isMandatory)
        const allStudies = sortBy(fetchedStudies.data || [], s => s.completedAt ? 1 : 0)
        const highlightedStudies = sampleSize(allStudies.filter(s => !s.isMandatory && !s.completedAt), 3)

        const studiesByTopic = groupBy(allStudies, (s) => tagOfType(s, 'topic') || 'topic:other') as any as StudyByTopics
        if (!studiesByTopic[filter]) {
            setFilter((Object.keys(studiesByTopic) as Array<StudyTopicID>)[0])
        }
        setStudyState({
            mandatoryStudy, allStudies, highlightedStudies, studiesByTopic,
        })
    }, [setStudyState])


    useEffect(() => {
        fetchStudies()
    }, [])

    const onMandatoryClose = useCallback(() => {
        setStudyState({ ...studies, mandatoryStudy: undefined })
        fetchStudies()
    }, [fetchStudies])

    return useMemo(() => ({
        ...studies,
        filter,
        setFilter,
        onMandatoryClose,
    }), [studies, onMandatoryClose, filter, setFilter])
}


interface StudyListProps {
    studies: ParticipantStudy[],
    title: string
    className: string
    onSelect(study: ParticipantStudy): void
}

const Grid = styled.div({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, [col-start] minmax(100px, 1fr) [col-end])',
    gridColumnGap: 20,
    gridRowGap: 20,
    [media.tablet]: {
        gridTemplateColumns: 'repeat(2, [col-start] minmax(100px, 1fr) [col-end])',
    },
    [media.mobile]: {
        display: 'flex',
        '.col': {
            maxWidth: '80vw',
            minWidth: '80vw',
        },
    },
})

const StudyList: FCWOC<StudyListProps> = ({ className, onSelect, title, studies, children }) => {

    return (
        <div className={cx('container-lg', 'studies', 'my-8', className)} >
            <h3 css={{ margin: '2rem 0' }}>{title}</h3>
            {children}
            {!studies.length && <h3>Awesome, you completed all studies! Watch out for new studies coming up soon!</h3>}
            <Grid>
                {studies.map(s => <StudyCard onSelect={onSelect} study={s} key={s.id} />)}
            </Grid>
        </div>
    )
}

interface FiltersProps {
    studies: StudyByTopics
    filter: StudyTopicID
    setFilter(filter: StudyTopicID): void
}


const filterProps = (type: StudyTopicID, filter: StudyTopicID, setType: (t: StudyTopicID) => void) => ({
    className: type == filter ? 'active' : '',
    'data-test-id': type,
    onClick() { setType(type) },
})

const Filters: React.FC<FiltersProps> = ({ studies, filter, setFilter }) => {
    if (useIsMobileDevice()) {
        return null
    }

    return (
        <Box gap="large" data-test-id="topic-tabs" wrap margin={{ bottom: 'large' }}
            css={{
                span: {
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    borderBottom: '3px solid transparent',
                    color: colors.grayText,
                    '&.active': {
                        borderBottomColor: colors.purple,
                        color: colors.purple,
                    },
                },
            }}
        >
            {studyTopicTagIDs.map((tag) => (
                studies[tag]?.length ?
                    <span role="tab" key={tag} {...filterProps(tag, filter, setFilter)}>{StudyTopicTags[tag]}</span> : null
            ))}
        </Box >
    )
}

interface AllSubjectsProps extends FiltersProps {
    onSelect(study: ParticipantStudy): void
}

const AllSubjects: FC<AllSubjectsProps> = ({
    onSelect,
    filter,
    setFilter,
    studies,
}) => {
    if (useIsMobileDevice()) {
        return (
            <>
                {studyTopicTagIDs.map((tag) => (
                    <StudyList key={tag} onSelect={onSelect} title={StudyTopicTags[tag]} className={tag} studies={studies[tag] || []} />
                ))}
            </>
        )
    }

    return (
        <StudyList onSelect={onSelect} title="View All Studies" className="filtered" studies={studies[filter] || []} >
            <Filters studies={studies} filter={filter} setFilter={setFilter} />
        </StudyList>
    )
}

const H = styled.h2({
    fontSize: 48,
    lineHeight: '64px',
    fontWeight: 700,
    marginBottom: 0,
    fontFamily: 'Helvetica Neue',
})

const Sh = styled.h6({
    fontFamily: 'Helvetica Neue',
    marginBottom: 0,
    fontSize: '18px',
    lineHeight: '30px',
})

const LearnerDashboard = () => {
    const nav = useNavigate()
    const isMobile = useIsMobileDevice()
    const onStudySelect = useCallback((s: ParticipantStudy) => nav(`/studies/details/${s.id}`), [nav])
    const {
        highlightedStudies, mandatoryStudy, allStudies, filter, onMandatoryClose, setFilter, studiesByTopic,
    } = useParticpantStudies()

    return (
        <div className="studies learner">
            <Routes>
                <Route path={'details/:studyId'} element={<StudyDetails studies={allStudies} />} />
            </Routes>
            <StudyModal study={mandatoryStudy} onHide={onMandatoryClose} />
            <Global styles={{ background: colors.pageBackground }} />
            <TopNavBar />
            <RewardsProgressBar studies={allStudies} />

            <Splash direction='column' justify='center' height={`${isMobile ? '400' : '600'}px`} className="splash">
                <SplashImage
                    preserveAspectRatio='xMidYMid slice'
                    css={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: -1,
                    }}
                />
                <div className="container-lg">
                    <div css={{ maxWidth: '55%', p: { marginBottom: 5 } }}>
                        <H>Level up to new ways of</H>
                        <H>learning, and earn prizes!</H>
                        <Sh className="mt-1">
                            With Kinetic, participate in scientific research and learn tips and tricks
                        </Sh>
                        <Sh>
                            to help you become a better learner. All while winning prizes!
                        </Sh>
                    </div>
                </div>
            </Splash >

            <StudyList onSelect={onStudySelect} title="Highlighted Studies on Kinetic" className="highlighted" studies={highlightedStudies} />

            <AllSubjects onSelect={onStudySelect} studies={studiesByTopic} filter={filter} setFilter={setFilter} />

            <Footer includeFunders />
        </div >
    )
}


export default LearnerDashboard
