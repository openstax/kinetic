import { React } from '@common'
import { useRef } from 'react'
import { ParticipantStudy } from '@api'
import { Footer, TopNavBar } from '@components'
import { useEnvironment, useIsMobileDevice } from '@lib'
import { useParticipantStudies, useSearchStudies } from './learner/studies'
import { StudyCard } from './learner/card'
import { StudyDetails } from './learner/details'
import { Route, Routes } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Pagination } from 'swiper/modules';
import { LearnerWelcomeModal } from './learner/learner-welcome-modal';
import { UnsupportedCountryModal } from './learner/unsupported-country-modal';
import { Badge, Box, Container, Flex, Group, Stack, Text, TextInput, Title, ScrollArea } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconSearch, IconX } from '@tabler/icons-react';
import { groupBy, filter } from 'lodash';
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

    return (
        <Box>
            <Swiper
                effect={'cards'}
                slidesPerView={'auto'}
                freeMode={true}
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
                {studies.map(study => (
                    <SwiperSlide key={study.id} className="pb-1" style={{ paddingTop: '1rem' }}>
                        <StudyCard study={study}/>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    )
}

export const DesktopStudyCards: FC<{studies: ParticipantStudy[]}> = ({ studies }) => {

    const [displayArrows, setDisplayArrows] = useState<boolean>(false)
    const [isOverflowing, setIsOverflowing] = useState(false);
    const viewport = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkOverflow = () => {
            if (viewport.current) {
                const overflow = viewport.current.scrollWidth > viewport.current.clientWidth;
                setIsOverflowing(overflow);
            }
        };

        checkOverflow();

        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [studies]);

    return (
        <Stack justify='center' style={{ position: 'relative' }} 
            onMouseOver={() => {
                setDisplayArrows(true)
            }} onMouseLeave={() => {
                setDisplayArrows(false)
            }}>
            <ScrollArea viewportRef={viewport} type='never'>
                <Flex align='center' justify='flex-start' gap='lg' pt='1rem' pb='2rem'>

                    {studies.map(study => (
                        <StudyCard key={study.id} study={study}/>
                    ))}
                                
                </Flex>
            </ScrollArea>

            <div style={{ position: 'absolute', left: -10, cursor: 'pointer', marginTop: '-1rem', display: isOverflowing && displayArrows ? 'block' : 'none' }}
                onClick={() => {
                    if(viewport.current){
                        viewport.current.scrollBy({ left: -200, behavior: 'smooth' })
                    }
                }}>
                <IconChevronLeft color={colors.purple} size='3.5rem'></IconChevronLeft>
            </div>
            <div style={{ position: 'absolute', right: -10, cursor: 'pointer', marginTop: '-1rem', display: isOverflowing && displayArrows ? 'block' : 'none' }}
                onClick={() => {
                    if(viewport.current){
                        viewport.current.scrollBy({ left: 200, behavior: 'smooth' })
                    }
                }}>
                <IconChevronRight color={colors.purple} size='3.5rem'></IconChevronRight>
            </div>   
        </Stack>
    )
}

export const StudiesByLearningPath: FC<{filteredStudies: ParticipantStudy[]}> = ({ filteredStudies }) => {
    const [learningPaths, studiesByLearningPath, completedStudiesByLearningPath] = useMemo(() => {
        return [
            orderBy(
                (uniqBy(filteredStudies.map(fs => fs.learningPath), (lp) => lp?.label)),
                ['completed', 'order'],
                ['asc', 'asc']
            ),
            groupBy(filteredStudies, (study) => {
                return study.learningPath?.label
            }),
            groupBy(filter(filteredStudies, (study) => study.completedAt != null), (study) => {
                return study.learningPath?.label
            }),
        ]
    }, [filteredStudies])

    const isMobile = useIsMobileDevice()

    const scrollToLearningPath = (learningPath: string) => {
        document.getElementById(learningPath)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const [hoveredLearningPath, setHoveredLearningPath] = useState<string | null>(null)

    const handleMouseEnter = (learningPath: string) => {
        setHoveredLearningPath(learningPath)
    }

    const handleMouseLeave = () => {
        setHoveredLearningPath(null)
    }

    return (
        <Flex direction='row' w='100%' gap='2.25rem'>
            <Flex 
                w='25%' 
                p='1rem 1.5rem 1.5rem 2.5rem'
                justify-content='center'
                direction='column'
                display={ isMobile? 'none' : 'flex' }
            >
                {learningPaths.map(learningPath => {
                    if (!learningPath) return null
                    return (
                        <Flex 
                            key={learningPath.label}
                            style={{ cursor: 'pointer' }}
                            c={ hoveredLearningPath === learningPath.label ? colors.blue : colors.gray70 }
                            onClick={() => scrollToLearningPath(learningPath.label)}
                            onMouseEnter={() => handleMouseEnter(learningPath.label)}
                            onMouseLeave={handleMouseLeave}
                            justify='space-between'
                            mb='1rem'
                        >
                            <Text>{learningPath.label}</Text>
                            <Text>
                                {completedStudiesByLearningPath[learningPath.label]? completedStudiesByLearningPath[learningPath.label].length : 0}
                                /
                                {studiesByLearningPath[learningPath.label].length}
                            </Text>
                        </Flex>
                    )
                })}
            </Flex>
            <Stack w='75%'  gap='lg' data-testid='studies-listing'>
                {learningPaths.map(learningPath => {
                    if (!learningPath) return null
                    const studies = sortBy(studiesByLearningPath[learningPath.label], (study) => !!study.completedAt)
                    return (
                        <Stack 
                            w='100%'
                            key={learningPath.label}
                            id={learningPath.label}
                        >
                            <Group gap='sm'>
                                <Title order={3}>
                                    {learningPath.label}
                                </Title>
                                <Text span>|</Text>
                                <Title order={3} fw='300'>
                                    {learningPath.description}
                                </Title>
                                {learningPath.completed ? <Badge c={colors.text} color={colors.green}>Completed</Badge> : null}
                            </Group>
                            {isMobile ?
                                <MobileStudyCards studies={studies} /> :
                                <DesktopStudyCards studies={studies} />
                            }
                        </Stack>
                    )
                })}
            </Stack>
        </Flex>
    )
}


export default LearnerDashboard
