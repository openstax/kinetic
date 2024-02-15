import { React } from '@common'
import { ParticipantStudy } from '@api'
import { Footer, RewardsProgressBar, TopNavBar } from '@components'
import { useEnvironment, useIsMobileDevice } from '@lib'
import { StudyTopic, studyTopics } from '@models'
import {
    getDemographicSurvey,
    getHighlightedStudies,
    StudyByTopics,
    useLearnerStudies,
    useParticipantStudies,
} from './learner/studies'
import { StudyCard } from './learner/card'
import { StudyDetails } from './learner/details'
import { Route, Routes } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, FreeMode, Mousewheel, Pagination } from 'swiper/modules';
import { LearnerWelcomeModal } from './learner/learner-welcome-modal';
import { UnsupportedCountryModal } from './learner/unsupported-country-modal';
import { Box, Container, Flex, SimpleGrid, Stack, TextInput, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { groupBy } from 'lodash';

interface StudyListProps {
    studies: ParticipantStudy[],
    title: string
}

const StudyList: FC<StudyListProps> = ({ title, studies }) => {
    return (
        <div className='container studies my-3'>
            <h3 css={{ margin: '2rem 0' }}>{title}</h3>
            {!studies.length && <h3>Awesome, you completed all studies! Watch out for new studies coming up soon!</h3>}
            <SimpleGrid cols={{ xs: 1, sm: 2, lg: 2, xl: 3 }} data-testid="studies-listing">
                {studies.map((s) => <StudyCard study={s} key={s.id} />)}
            </SimpleGrid>
        </div>
    )
}

// const MobileStudyList: FC<StudyListProps> = ({ title, studies }) => {
//     return (
//         <div className='container-lg studies my-3'>
//             <h3 className='py-2'>{title}</h3>
//             {!studies.length && <h3>Awesome, you completed all studies! Watch out for new studies coming up soon!</h3>}
//
//             <Swiper
//                 effect={'cards'}
//                 slidesPerView={'auto'}
//                 cardsEffect={{
//                     slideShadows: false,
//                     perSlideOffset: 14,
//                 }}
//                 centeredSlides={true}
//                 pagination
//                 modules={[EffectCards, Pagination]}
//                 className="pb-3 mb-2 overflow-hidden"
//             >
//                 {studies.map((study) => (
//                     <SwiperSlide key={study.id} className="pb-1">
//                         <StudyCard study={study} />
//                     </SwiperSlide>
//                 ))}
//             </Swiper>
//         </div>
//     )
// }

// TODO rename
// interface FiltersProps {
//     studies: StudyByTopics
//     filter: StudyTopic
//     setFilter(filter: StudyTopic): void
// }

// const AllSubjects: FC<FiltersProps> = ({
//     filter,
//     setFilter,
//     studies,
// }) => {
//     if (useIsMobileDevice()) {
//         return (
//             <>
//                 {studyTopics
//                     .filter((topic) => !!studies[topic]?.length)
//                     .map((topic) => (
//                         <MobileStudyList key={topic} title={topic} studies={studies[topic] || []} />
//                     ))
//                 }
//             </>
//         )
//     }
//
//     return (
//         <StudyList title="View All Studies" studies={studies[filter] || []} />
//     )
// }

const HighlightedStudies: FC<StudyListProps> = ({ studies, title }) => {
    if (useIsMobileDevice()) {
        return (
            <>
                {/*<MobileStudyList title={title} studies={studies} />*/}
            </>
        )
    }

    return (
        <StudyList title={title} studies={studies} />
    )
}

const LearnerDashboard = () => {
    const env = useEnvironment()

    const studies = useParticipantStudies();
    const demographicSurvey = getDemographicSurvey(studies);
    const highlightedStudies = getHighlightedStudies(studies)


    const {
        // highlightedStudies,
        allStudies,
        filter,
        setFilter,
        studiesByTopic,
        // demographicSurvey,
    } = useLearnerStudies()

    if (!env.isEligible) {
        return <UnsupportedCountryModal />
    }

    return (
        <div className="studies learner">
            <Routes>
                <Route path={'details/:studyId'} element={<StudyDetails />} />
            </Routes>

            <TopNavBar />

            <LearnerWelcomeModal demographicSurvey={demographicSurvey} />

            <RewardsProgressBar studies={allStudies} />

            {/* Temporarily disable syllabus contest due to legal, keep it just in case we re-enable in the future */}
            {/*<SyllabusContest studies={syllabusContestStudies} />*/}

            {/* TODO Uncomment after dev */}
            {/*<HighlightedStudies studies={highlightedStudies} title="Highlighted Studies on Kinetic" />*/}

            <StudiesContainer />
            {/*<AllSubjects studies={studiesByTopic} filter={filter} setFilter={setFilter} />*/}

            <Footer includeFunders />
        </div>
    )
}

export const StudiesContainer = () => {
    // TODO Implement search later
    const [search, setSearch] = useState('')

    return (
        <Container my='lg'>
            <Stack gap='lg'>
                <Flex justify='space-between' wrap='wrap'>
                    <Title order={2}>All Studies</Title>

                    <TextInput
                        w='400'
                        rightSectionPointerEvents="none"
                        rightSection={<IconSearch />}
                        placeholder="Search by study title, researcher, or topic name"
                    />
                </Flex>

                <StudiesByTopic />
            </Stack>

        </Container>
    )
}

export const StudiesByTopic = () => {
    const participantStudies = useParticipantStudies()
    const studiesByTopic = groupBy(participantStudies, (study) => study.topic)
    const isMobile = useIsMobileDevice()

    if (isMobile) {
        return (
            <Stack gap='lg'>
                {Object.entries(studiesByTopic).map(([studyTopic, studies]) => {
                    return (
                        <Stack key={studyTopic}>
                            <Title order={4}>{studyTopic}</Title>
                            <Box>
                                <Swiper
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
                                    {studies.map((study) => (
                                        <SwiperSlide key={study.id} className="pb-1">
                                            <StudyCard study={study} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </Box>
                        </Stack>
                    )
                })}
            </Stack>
        )
    }

    return (
        <Stack gap='lg'>
            {Object.entries(studiesByTopic).map(([studyTopic, studies]) => {
                return (
                    <Stack key={studyTopic}>
                        <Title order={4}>{studyTopic}</Title>
                        <Box>
                            <Swiper
                                slidesPerView={3}
                                simulateTouch={true}
                                freeMode={true}
                                pagination={{ clickable: true }}
                                style={{
                                    paddingBottom: '2rem',
                                    marginBottom: '1rem',
                                }}
                                modules={[FreeMode, Pagination]}
                            >
                                {studies.map(study => (
                                    <SwiperSlide style={{ padding: '1rem' }} key={study.id}>
                                        <StudyCard study={study} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </Box>
                    </Stack>
                )
            })}
        </Stack>
    )
}


export default LearnerDashboard
