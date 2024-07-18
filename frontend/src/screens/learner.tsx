import { React, styled } from '@common'
import { useRef } from 'react'
import { ParticipantStudy } from '@api'
import { Footer, TopNavBar } from '@components'
import { useEnvironment, useIsMobileDevice } from '@lib'
import { useParticipantStudies, useSearchStudies } from './learner/studies'
import { StudyCard } from './learner/card'
import { StudyDetails } from './learner/details'
import { Route, Routes } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards, FreeMode, Navigation, Pagination } from 'swiper/modules'
import { LearnerWelcomeModal } from './learner/learner-welcome-modal'
import { UnsupportedCountryModal } from './learner/unsupported-country-modal'
import { Badge, Affix, Button, Transition, Box, Container, Flex, Divider, Group, ActionIcon, Stack, Text, TextInput, Title, ScrollArea } from '@mantine/core'
import { IconSearch, IconX, IconPlus, IconMinus, IconArrowUp, IconChevronLeft, IconChevronRight, IconChevronDown } from '@tabler/icons-react'
import { groupBy, orderBy, uniqBy, sortBy, filter } from 'lodash'
import { colors } from '@theme'
import { FC, useMemo, useState, useEffect } from 'react'
import { useWindowScroll } from '@mantine/hooks'

const HighlightedStudies: FC = () => {
    const { highlightedStudies } = useParticipantStudies()
    const isMobile = useIsMobileDevice()

    const scrollToStudies = () => {
        const element = document.getElementById('all-studies-unique-id')
        element?.scrollIntoView({ behavior: 'smooth' })
    }

    if (!highlightedStudies.length) return null

    return (
        <Box bg={colors.navy} py='md'>
            <Container>
                <Stack>
                    <Group align='center' justify='space-between'>
                        {isMobile ?
                            <MobileStudyCards studies={highlightedStudies} /> :
                            <>
                                <CuratedStudies /> 
                                <div style={{ width: '70%' }}><DesktopStudyCards studies={highlightedStudies} /></div>
                            </>
                        }
                    </Group>
                    <Group c={colors.green} justify='center' align='center'>
                        <Stack justify='center' align='center' gap='0' style={{ cursor: 'pointer' }} onClick={()=> scrollToStudies()}>
                            <Text size='sm'>View all studies</Text>
                            <IconChevronDown size='1.5rem'/>
                        </Stack>
                    </Group>
                </Stack>
            </Container>
        </Box>
    )
}

const CuratedStudies: FC = () => {
    return (
        <Stack c={colors.white} w='23%'>
            <Title order={2}>Curated Studies</Title>
            <Title order={5} mt='-1.2rem'>by our learning scientists</Title>

            <Stack>
                <Text pr='1.5rem'>Deepen your understanding of learning habits with scientific studies currated by our team of education researchers.</Text>
                <Text>Accelerate your growth and tailor your path to your own needs.</Text>
            </Stack>
        </Stack>
    )
}

const LearnerDashboard = () => {
    const env = useEnvironment()
    const [scroll, scrollTo] = useWindowScroll();

    if (!env.isEligible) {
        return <UnsupportedCountryModal />;
    }
    const isVisible = scroll.y > window.innerHeight * 0.25;

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
            <Affix position={{ bottom: 20, left: 20 }}>
                <Transition transition="slide-up" mounted={isVisible}>
                    {(transitionStyles) => (
                        <Button
                            onClick={() => scrollTo({ y: 0 })}
                            style={transitionStyles}
                            radius="xl"
                            p={0}
                            w={48}
                            h={48}
                            bg="#007bff"
                        >
                            <IconArrowUp size="1.5rem" color="#fff" />
                        </Button>
                    )}
                </Transition>
            </Affix>
            <Footer includeFunders />
        </div>
    )
}

export const SearchBar: FC<{
    search: string;
    setSearch: (search: string) => void;
}> = ({ search, setSearch }) => {
    const isMobile = useIsMobileDevice();

    return (
        <TextInput
            w={isMobile ? '100%' : '600px'}
            size='md'
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            rightSection={
                search.length ? (
                    <IconX onClick={() => setSearch('')} style={{ cursor: 'pointer' }}/>
                ) : (
                    <ActionIcon variant="subtle" color="#848484">
                        <IconSearch size="1.1rem" stroke={1.5} />
                    </ActionIcon>
                )
            }
            placeholder="Search by study title, researcher, or topic name"
            rightSectionWidth={40}
            styles={(theme) => ({
                root: {
                    maxWidth: '400px',
                },
                input: {
                    borderRadius: '50px',
                    border: '1px solid #848484',
                    paddingLeft: '20px',
                    '&:focus': {
                        borderColor: theme.colors.blue[6],
                    },
                },
                rightSection: {
                    pointerEvents: 'none',
                },
            })}
        />
    )
}

export const StudiesTitle: FC<{search: string, filteredStudies: ParticipantStudy[]}> = () => {
    return (
        <Title order={2} id='all-studies-unique-id'>All Studies</Title>
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

const Circle = styled.div({
    borderRadius: '50%',
    border: `1px solid ${colors.blue}`,
    backgroundColor: colors.white,
    width: '.875rem',
    height: '.875rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})

const StudyDuration: FC<{duration: Set<Number>, setDuration: Function, durationText: Number}> = ({ duration, setDuration, durationText }) => {
    const handleDurationChange = (duration:Number) => {
        setDuration((prev:Set<Number>) => {
            const newDuration = new Set<Number>(prev)
            if(newDuration.has(duration)){
                newDuration.delete(duration)
            }else{
                newDuration.add(duration)
            }
            return newDuration
        })
    }

    const [active, setActive] = useState<Boolean>(() => {
        return duration.has(durationText)
    })

    useEffect(() => {
        setActive(() => {
            return duration.has(durationText)
        })
    }, [duration, durationText])

    return (
        <Flex justify='center' align='center' gap='.5rem' 
            pt='.25rem' pb='.25rem' pl='.625rem' pr='.625rem'
            bg={ active? colors.blue: colors.white }
            style={{ border: `1px solid ${colors.blue}`, borderRadius: '50rem', transition: 'all .1s ease-in', cursor: 'pointer' }}
            onClick={() => {
                handleDurationChange(durationText)
            }}>
            <Text size='sm' c={ active? colors.white: colors.blue }>~{String(durationText)} min</Text> 
            <Circle>{active? <IconMinus size={10} color={colors.blue} stroke={3}/>: <IconPlus size={10} color={colors.blue} stroke={3}/>}</Circle>
        </Flex>
    )
}

export const StudiesContainer = () => {
    const { search, setSearch, duration, setDuration, filteredStudies } = useSearchStudies()

    return (
        <Container pt='1.5rem' bg={colors.ash}>
            <Stack gap='lg'>
                <StudiesTitle search={search} filteredStudies={filteredStudies} />
                <Group justify='space-between' wrap='wrap' >
                    <Flex justify='center' align='center' gap='md'>
                        <StudyDuration duration={duration} durationText={5} setDuration={setDuration}></StudyDuration>
                        <StudyDuration duration={duration} durationText={15} setDuration={setDuration}></StudyDuration>
                        <StudyDuration duration={duration} durationText={25} setDuration={setDuration}></StudyDuration>
                    </Flex>
                    <SearchBar search={search} setSearch={setSearch} />
                </Group>

                <SearchResults search={search} filteredStudies={filteredStudies} />
                <Divider my="sm" />

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
                {studies.map((study) => (
                    <SwiperSlide key={study.id} className="pb-1" style={{ paddingTop: '1rem' }}>
                        <StudyCard study={study} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    )
}

export const DesktopStudyCards: FC<{studies: ParticipantStudy[]}> = ({ studies }) => {
    const [displayArrows, setDisplayArrows] = useState<boolean>(false)
    const viewport = useRef<HTMLDivElement>(null);

    const checkOverflow = () => {
        if (viewport.current) {
            const overflow = viewport.current.scrollWidth > viewport.current.clientWidth;
            return overflow
        }
        return false
    };

    return (
        <Stack justify='center' style={{ position: 'relative' }} 
            onMouseOver={() => {
                if(checkOverflow()){
                    setDisplayArrows(true)
                }
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

            <div style={{ position: 'absolute', left: -10, cursor: 'pointer', marginTop: '-1rem', display: displayArrows ? 'block' : 'none' }}
                onClick={() => {
                    if(viewport.current){
                        viewport.current.scrollBy({ left: -200, behavior: 'smooth' })
                    }
                }}>
                <IconChevronLeft color={colors.purple} size='3.5rem'></IconChevronLeft>
            </div>
            <div style={{ position: 'absolute', right: -10, cursor: 'pointer', marginTop: '-1rem', display: displayArrows ? 'block' : 'none' }}
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
        <Flex direction='row' gap='xl'>
            <Flex 
                w='25%' 
                p='1rem 1.5rem 1.5rem 2.5rem'
                justify-content='center'
                direction='column'
                display={ isMobile? 'none' : 'flex' }
            >
                {learningPaths.map((learningPath) => {
                    if (!learningPath) return null
                    return (<Flex
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
            <Stack w='75%'  gap='lg' data-testid='studies-listing' c={colors.text}>
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
                                <Title order={3} c={colors.gray90}>
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
