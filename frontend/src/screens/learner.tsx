import { React } from '@common'
import { ParticipantStudy } from '@api'
import { Footer, TopNavBar, Icon } from '@components'
import { useEnvironment, useIsMobileDevice } from '@lib'
import { useParticipantStudies, useSearchStudies } from './learner/studies'
import { StudyCard } from './learner/card'
import { StudyDetails } from './learner/details'
import { Route, Routes } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Pagination } from 'swiper/modules';
import { LearnerWelcomeModal } from './learner/learner-welcome-modal';
import { UnsupportedCountryModal } from './learner/unsupported-country-modal';
import { Box, Container, Flex, Group, Stack, TextInput, Title } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { groupBy } from 'lodash';
import { colors } from '@theme'
import { useMemo, useState, useEffect } from 'react';
import { orderBy, sortBy, uniqBy } from 'lodash-es';

const HighlightedStudies: FC = () => {
    const { highlightedStudies } = useParticipantStudies()
    const isMobile = useIsMobileDevice()

    if (!highlightedStudies.length) return null

    return (
        <Box bg={colors.navy} py='md'>
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

    if (!env.isEligible) {
        return <UnsupportedCountryModal />
    }

    return (
        <div className="studies learner">
            <Routes>
                <Route path={'details/:studyId'} element={<StudyDetails />} />
            </Routes>

            <TopNavBar />

            <LearnerWelcomeModal />

            {/* Temporarily removing this as well until reward system reworked */}
            {/*<RewardsProgressBar />*/}

            {/* Temporarily disable syllabus contest due to legal, keep it just in case we re-enable in the future */}
            {/*<SyllabusContest studies={syllabusContestStudies} />*/}

            <HighlightedStudies />

            <StudiesContainer />

            <Footer includeFunders />
        </div>
    )
}

export const SearchBar: FC<{search: string, setSearch: (search: string) => void}> = ({ search, setSearch }) => {
    const isMobile = useIsMobileDevice()

    return (
        <TextInput
            w={isMobile ? '100%' : '400px'}
            size='lg'
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            rightSection={search.length ?
                <IconX onClick={() => setSearch('')} style={{ cursor: 'pointer' }}/> :
                <IconSearch />
            }
            placeholder="Search by study title, researcher, or topic name"
        />
    )
}

export const StudiesTitle: FC<{search: string, filteredStudies: ParticipantStudy[]}> = () => {
    return (
        <Title order={2}>All Studies</Title>
    )
}

export const SearchResults: FC<{search: string, filteredStudies: ParticipantStudy[]}> = ({ search, filteredStudies }) => {
    if (!search) {
        return null
    }

    if (filteredStudies.length == 0) {
        return (
            <Title order={4}>
                Sorry, no results found for '{search}'
            </Title>
        )
    }

    return (
        <Title order={4}>
            {filteredStudies.length} result{filteredStudies.length == 1 ? '' : 's'} for '{search}'
        </Title>
    )
}

export const StudiesContainer = () => {
    const { search, setSearch, filteredStudies } = useSearchStudies()

    return (
        <Container pt='1.5rem' bg={colors.ash}>
            <Stack gap='lg'>
                <Flex justify='space-between' wrap='wrap'>
                    <StudiesTitle search={search} filteredStudies={filteredStudies} />

                    <SearchBar search={search} setSearch={setSearch} />
                </Flex>

                <SearchResults search={search} filteredStudies={filteredStudies} />

                <StudiesByLearningPath filteredStudies={filteredStudies} />
            </Stack>
        </Container>
    )
}

export const MobileStudyCards: FC<{studies: ParticipantStudy[]}> = ({ studies }) => {

    const [hovered, setHovered] = useState<Number>(-1)
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
                pagination={{
                    enabled: true,
                    dynamicBullets: true,
                    dynamicMainBullets: 5,
                }}
                modules={[EffectCards, Pagination]}
                style={{
                    paddingBottom: '2rem',
                    marginBottom: '1rem',
                }}
            >
                {studies.map((study, index) => (
                    <SwiperSlide key={study.id} className="pb-1" style={{ paddingTop: '1rem' }}>
                        <StudyCard study={study} index={index} hovered={hovered} setHovered={setHovered}/>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    )
}

export const DesktopStudyCards: FC<{studies: ParticipantStudy[]}> = ({ studies }) => {

    const [hovered, setHovered] = useState(-1)
    const [displayArrows, setDisplayArrows] = useState<boolean>(false)
    const [element, setElement] = useState<HTMLDivElement | null>(null)

    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            if (element) {
                const overflow = element.scrollWidth > element.clientWidth;
                setIsOverflowing(overflow);
            }
        };

        checkOverflow();

        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [studies, element]);

    return (
        <Box style={{ position: 'relative', paddingLeft: '3rem', paddingRight: '3rem' }} onMouseOver={() => {
            setDisplayArrows(true)
        }} onMouseLeave={() => {
            setDisplayArrows(false)
        }}>
            {/* <Swiper
                slidesPerView={3}
                simulateTouch={true}
                freeMode={true}
                pagination={{
                    enabled: true,
                    dynamicBullets: true,
                    dynamicMainBullets: 5,
                    clickable: true,
                }}
                style={{
                    marginBottom: '1rem',
                    paddingBottom: '2rem',
                    paddingLeft: '2rem',
                    paddingRight: '2rem',
                }}
                navigation={{
                    enabled: true,
                }}
                modules={[FreeMode, Pagination, Navigation]}
            >
                {studies.map(study => (
                    <SwiperSlide style={{ padding: '1rem', position: 'static'}} key={study.id}>
                        <StudyCard study={study} />
                    </SwiperSlide>
                ))}
            </Swiper> */}
            <Flex ref={(ele) => setElement(ele)} align='center' justify='flex-start' gap='lg' pt='1rem' pb='2rem' style={{ overflowX: 'auto', overflowY: 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }} className='hide-scrollbar'>
                <style>
                    {`
                        .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                        }

                        .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                        }
                    `}
                </style>
                {studies.map((study, index) => (
                    <StudyCard key={study.id} study={study} index={index} hovered={hovered} setHovered={setHovered}/>
                ))}
                
                <div style={{ position: 'absolute', left: '0', cursor: 'pointer', display: isOverflowing && displayArrows ? 'block' : 'none' }}
                    onClick={() => {
                        if(element){
                            element.scrollBy({ left: -200, behavior: 'smooth' })
                        }
                    }}>
                    <Icon icon='arrowLeft' color={colors.purple} width='3rem'></Icon>
                </div>
                <div style={{ position: 'absolute', right: '0', cursor: 'pointer', display: isOverflowing && displayArrows ? 'block' : 'none' }}
                    onClick={() => {
                        if(element){
                            element.scrollBy({ left: 200, behavior: 'smooth' })
                        }
                    }}>
                    <Icon icon='arrowRight' color={colors.purple} width='3rem'></Icon>
                </div>               
            </Flex>
        </Box>
    )
}

export const StudiesByLearningPath: FC<{filteredStudies: ParticipantStudy[]}> = ({ filteredStudies }) => {
    const [learningPaths, studiesByLearningPath] = useMemo(() => {
        return [
            orderBy(
                (uniqBy(filteredStudies.map(fs => fs.learningPath), (lp) => lp?.label)),
                ['completed', 'order'],
                ['asc', 'asc']
            ),
            groupBy(filteredStudies, (study) => study.learningPath?.label),
        ]
    }, [filteredStudies])

    const isMobile = useIsMobileDevice()

    return (
        <Stack gap='lg' data-testid='studies-listing'>
            {learningPaths.map(learningPath => {
                if (!learningPath) return null
                const studies = sortBy(studiesByLearningPath[learningPath.label], (study) => !!study.completedAt)

                return (
                    <Stack key={learningPath.label}>
                        <Group gap='xs'>
                            <Title order={3}>
                                {learningPath.label}
                            </Title>
                            <Title style={{ color: colors.purple }} order={5}>|</Title>
                            <Title order={3} fw='300'>
                                {learningPath.description}
                            </Title>
                        </Group>
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
