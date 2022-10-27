import { React, useCallback, cx } from '@common'
import { ParticipantStudy } from '@api'
import styled from '@emotion/styled'
import { colors, media } from '../theme'
import { Global } from '@emotion/react'
import {
    Box, RewardsProgressBar, TopNavBar, Footer,
} from '@components'
import { useIsMobileDevice } from '@lib'
import {
    StudyTopicTags, studyTopicTagIDs, StudyTopicID,
} from '@models'
import { useLearnerStudies, StudyByTopics } from './learner/studies'
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
            <Grid css={{ overflow: 'auto', paddingBottom: '10px' }} data-test-id="studies-listing">
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
                {studyTopicTagIDs
                    .filter((tag) => !!studies[tag]?.length)
                    .map((tag) => (
                        <StudyList key={tag} onSelect={onSelect} title={StudyTopicTags[tag]} className={tag} studies={studies[tag] || []} />
                    ))
                }
            </>
        )
    }

    return (
        <StudyList onSelect={onSelect} title="View All Studies" className="filtered" studies={studies[filter] || []} >
            <Filters studies={studies} filter={filter} setFilter={setFilter} />
        </StudyList>
    )
}

const LearnerDashboard = () => {
    const nav = useNavigate()
    const isMobile = useIsMobileDevice()
    const onStudySelect = useCallback((s: ParticipantStudy) => nav(`/studies/details/${s.id}`), [nav])
    const {
        highlightedStudies, mandatoryStudy, allStudies, filter, onMandatoryClose, setFilter, studiesByTopic,
    } = useLearnerStudies()

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
                        <h1>Level up to new ways of learning, and earn prizes!</h1>
                        <h4>
                            With Kinetic, participate in scientific research and learn tips and tricks to help you become a better learner. All while winning prizes!
                        </h4>
                    </div>
                </div>
            </Splash >

            <StudyList onSelect={onStudySelect} title="Highlighted Studies on Kinetic" className="highlighted" studies={highlightedStudies} />

            <AllSubjects onSelect={onStudySelect} studies={studiesByTopic} filter={filter} setFilter={setFilter} />

            <Footer includeFunders />
        </div>
    )
}


export default LearnerDashboard
