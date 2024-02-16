import { React } from '@common'
import { ParticipantStudy } from '@api'
import { Footer, RewardsProgressBar, TopNavBar } from '@components'
import { useEnvironment, useIsMobileDevice } from '@lib'
import { useParticipantStudies } from './learner/studies'
import { StudyCard } from './learner/card'
import { StudyDetails } from './learner/details'
import { Route, Routes } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, FreeMode, Pagination } from 'swiper/modules';
import { LearnerWelcomeModal } from './learner/learner-welcome-modal';
import { UnsupportedCountryModal } from './learner/unsupported-country-modal';
import { Box, Container, Flex, Stack, TextInput, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { groupBy } from 'lodash';
import { colors } from '@theme'

const HighlightedStudies: FC = () => {
    const { highlightedStudies } = useParticipantStudies()
    const isMobile = useIsMobileDevice()

    return (
        <Box bg={colors.navy} py='lg'>
            <Container>
                <Stack>
                    <Title c='white' order={2}>Highlighted Studies</Title>
                    {isMobile ?
                        <MobileStudyCards studies={highlightedStudies} /> :
                        <DesktopStudyCards studies={highlightedStudies} />
                    }
                </Stack>
            </Container>
        </Box>
    )
}

const LearnerDashboard = () => {
    const env = useEnvironment()

    const { demographicSurvey, allStudies } = useParticipantStudies();

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

            <HighlightedStudies />

            <StudiesContainer />

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

export const MobileStudyCards: FC<{studies: ParticipantStudy[]}> = ({ studies }) => {
    return (
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
    )
}

export const DesktopStudyCards: FC<{studies: ParticipantStudy[]}> = ({ studies }) => {
    return (
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
    )
}

export const StudiesByTopic = () => {
    const { nonHighlightedStudies } = useParticipantStudies()
    const studiesByTopic = groupBy(nonHighlightedStudies, (study) => study.topic)
    const isMobile = useIsMobileDevice()

    return (
        <Stack gap='lg'>
            {Object.entries(studiesByTopic).map(([studyTopic, studies]) => {
                return (
                    <Stack key={studyTopic}>
                        <Title order={4}>{studyTopic}</Title>
                        {isMobile ?
                            <MobileStudyCards studies={studies} /> :
                            <DesktopStudyCards studies={studies} />
                        }
                    </Stack>
                )
            })}
        </Stack>
    )
}


export default LearnerDashboard
