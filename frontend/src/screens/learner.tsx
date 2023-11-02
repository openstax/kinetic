import { cx, React, useCallback } from '@common'
import { ParticipantStudy } from '@api'
import styled from '@emotion/styled'
import { colors, media } from '@theme'
import { Box, Footer, RewardsProgressBar, TopNavBar } from '@components'
import { useIsMobileDevice } from '@lib'
import { StudyTopic, studyTopics } from '@models'
import { StudyByTopics, useLearnerStudies } from './learner/studies'
import { StudyCard } from './learner/card'
import { StudyModal } from './studies/modal'
import { StudyDetails } from './learner/details'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { chunk } from 'lodash-es'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Pagination } from 'swiper';
import { SyllabusContest } from './learner/syllabus-contest';

interface StudyListProps {
    studies: ParticipantStudy[],
    title: string
    className: string
    onSelect(study: ParticipantStudy): void
}

const Grid = styled.div({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, [col-start] minmax(100px, 1fr) [col-end])',
    columnGap: 20,
    rowGap: 20,
    [media.tablet]: {
        gridTemplateColumns: 'repeat(2, [col-start] minmax(100px, 1fr) [col-end])',
    },
})

const StudyList: FCWOC<StudyListProps> = ({ className, onSelect, title, studies, children }) => {
    return (
        <div className={cx('container', 'studies', 'my-3', className)} >
            <h3 css={{ margin: '2rem 0' }}>{title}</h3>
            {children}
            {!studies.length && <h3>Awesome, you completed all studies! Watch out for new studies coming up soon!</h3>}
            <Grid css={{ overflow: 'auto', paddingBottom: '10px' }} data-testid="studies-listing">
                {studies.map((s) => <StudyCard onSelect={onSelect} study={s} key={s.id} />)}
            </Grid>
        </div>
    )
}

const MobileStudyList: FCWOC<StudyListProps> = ({ className, onSelect, title, studies, children }) => {
    return (
        <div className={cx('container-lg', 'studies', 'my-3', className)}>
            <h3 className='py-2'>{title}</h3>
            {children}
            {!studies.length && <h3>Awesome, you completed all studies! Watch out for new studies coming up soon!</h3>}

            {chunk(studies, 6).map((studyChunk, i) =>
                <Swiper
                    key={i}
                    effect={'cards'}
                    slidesPerView={'auto'}
                    cardsEffect={{
                        slideShadows: false,
                        perSlideOffset: 14,
                    }}
                    centeredSlides={true}
                    pagination
                    modules={[EffectCards, Pagination]}
                    className="pb-3 mb-2 overflow-hidden"
                >
                    {studyChunk.map((s) =>
                        <SwiperSlide key={s.id} className="pb-1">
                            <StudyCard onSelect={onSelect} study={s} />
                        </SwiperSlide>
                    )}
                </Swiper>
            )}
        </div>
    )
}

interface FiltersProps {
    studies: StudyByTopics
    filter: StudyTopic
    setFilter(filter: StudyTopic): void
}

const TopicFilter: FC<{topic: StudyTopic, filter: StudyTopic, setFilter: (t: StudyTopic) => void}> = ({
    topic, filter, setFilter,
}) => {
    return (
        <span
            className={topic == filter ? 'active' : ''}
            data-testid={topic}
            onClick={() => setFilter(topic)}
            role="tab"
        >
            {topic}
        </span>

    )
}

const Filters: React.FC<FiltersProps> = ({ studies, filter, setFilter }) => {
    if (useIsMobileDevice()) {
        return null
    }

    return (
        <Box gap="large" data-testid="topic-tabs" wrap margin={{ bottom: 'large' }}
            css={{
                span: {
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    borderBottom: '3px solid transparent',
                    color: colors.text,
                    '&.active': {
                        borderBottomColor: colors.purple,
                        color: colors.purple,
                    },
                },
            }}
        >
            {studyTopics.map((topic) => (
                studies[topic]?.length && <TopicFilter topic={topic} key={topic} filter={filter} setFilter={setFilter} />
            ))}
        </Box>
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
                {studyTopics
                    .filter((topic) => !!studies[topic]?.length)
                    .map((topic) => (
                        <MobileStudyList key={topic} onSelect={onSelect} title={topic} className={topic} studies={studies[topic] || []} />
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

const HighlightedStudies: FCWOC<StudyListProps> = ({ onSelect, studies, title, className }) => {
    if (useIsMobileDevice()) {
        return (
            <>
                <MobileStudyList onSelect={onSelect} title={title} className={className} studies={studies} />
            </>
        )
    }

    return (
        <StudyList onSelect={onSelect} title={title} className={className} studies={studies} />
    )
}

const LearnerDashboard = () => {
    const nav = useNavigate()
    const onStudySelect = useCallback((s: ParticipantStudy) => nav(`/studies/details/${s.id}`), [nav])
    const {
        highlightedStudies,
        mandatoryStudy,
        allStudies,
        filter,
        onMandatoryClose,
        setFilter,
        studiesByTopic,
        syllabusContestStudies,
    } = useLearnerStudies()

    return (
        <div className="studies learner">
            <Routes>
                <Route path={'details/:studyId'} element={<StudyDetails studies={allStudies} />} />
            </Routes>
            <StudyModal study={mandatoryStudy} onHide={onMandatoryClose} />
            <TopNavBar />
            <RewardsProgressBar studies={allStudies} />

            <SyllabusContest studies={syllabusContestStudies} />

            <HighlightedStudies studies={highlightedStudies} title="Highlighted Studies on Kinetic" className="highlighted" onSelect={onStudySelect}/>

            <AllSubjects onSelect={onStudySelect} studies={studiesByTopic} filter={filter} setFilter={setFilter} />

            <Footer includeFunders />
        </div>
    )
}


export default LearnerDashboard
