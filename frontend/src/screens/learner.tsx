import { React } from '@common';
import { FC, useMemo, ReactNode } from 'react';
import { ParticipantStudy } from '@api';
import { Footer, TopNavBar } from '@components';
import { useEnvironment, useIsMobileDevice } from '@lib';
import { useParticipantStudies, useSearchStudies } from './learner/studies';
import { StudyCard } from './learner/card';
import { StudyDetails } from './learner/details';
import { Route, Routes } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, FreeMode } from 'swiper/modules';
import { LearnerWelcomeModal } from './learner/learner-welcome-modal';
import { UnsupportedCountryModal } from './learner/unsupported-country-modal';
import {
    Badge,
    Box,
    Container,
    Divider,
    Flex,
    Group,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { groupBy, orderBy, uniqBy } from 'lodash-es';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { colors } from '@theme';
import { useWindowScroll } from '@mantine/hooks';
import { Button } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';


const sortAndMapStudies = (
    studies: ParticipantStudy[],
    renderStudy: (study: ParticipantStudy) => ReactNode
) => {
    return studies
        .sort((a, b) =>
            a.completedAt === b.completedAt
                ? 0
                : a.completedAt
                    ? 1
                    : -1
        )
        .map((study) => renderStudy(study));
};


const HighlightedStudies: FC = () => {
    const { highlightedStudies } = useParticipantStudies();
    const isMobile = useIsMobileDevice();

    if (!highlightedStudies.length) return null;

    return (
        <Box bg={colors.navy} py='md'>
            <Container>
                <Stack>
                    <Title c="white" order={2}>
                        Highlighted Studies
                    </Title>
                    {isMobile ? (
                        <MobileStudyCards studies={highlightedStudies} />
                    ) : (
                        <DesktopStudyCards studies={highlightedStudies} />
                    )}
                </Stack>
            </Container>
        </Box>
    );
};

const LearnerDashboard = () => {
    const env = useEnvironment();
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
            {isVisible && (
                <Box
                    style={{
                        position: 'fixed',
                        left: '1rem',
                        bottom: '1rem',
                        zIndex: 1000,
                    }}
                >
                    <Button
                        onClick={() => scrollTo({ y: 0 })}
                        style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            borderRadius: '50%',
                            width: '3rem',
                            height: '3rem',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <IconArrowUp />
                    </Button>
                </Box>
            )}

            <Footer includeFunders />
        </div>
    );
};

export const SearchBar: FC<{
    search: string;
    setSearch: (search: string) => void;
}> = ({ search, setSearch }) => {
    const isMobile = useIsMobileDevice();

    return (
        <TextInput
            w={isMobile ? '100%' : '400px'}
            size='lg'
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            rightSection={
                search.length ? (
                    <IconX onClick={() => setSearch('')} />
                ) : (
                    <IconSearch />
                )
            }
            placeholder="Search by study title, researcher, or topic name"
        />
    );
};

export const StudiesTitle: FC = () => {
    return <Title order={2}>View all Studies</Title>;
};

export const SearchResults: FC<{
    search: string;
    filteredStudies: ParticipantStudy[];
}> = ({ search, filteredStudies }) => {
    if (!search) {
        return null;
    }

    if (filteredStudies.length === 0) {
        return <Title order={4}>Sorry, no results found for '{search}'</Title>;
    }

    return (
        <Title order={4}>
            {filteredStudies.length} result
            {filteredStudies.length === 1 ? '' : 's'} for '{search}'
        </Title>
    );
};

export const StudiesContainer = () => {
    const { search, setSearch, filteredStudies } = useSearchStudies();

    return (
        <Container my='lg'>
            <Stack gap='lg'>
                <Flex justify="space-between" wrap="wrap">
                    <StudiesTitle />

                    <SearchBar search={search} setSearch={setSearch} />
                </Flex>

                {/* Divider */}
                <Divider
                    my="md"
                    size="sm"
                    color="#dbdbdb"
                    w={864}
                    style={{ border: '1px solid #dbdbdb' }}
                />

                <SearchResults
                    search={search}
                    filteredStudies={filteredStudies}
                />

                <StudiesByLearningPath filteredStudies={filteredStudies} />
            </Stack>
        </Container>
    );
};

export const MobileStudyCards: FC<{ studies: ParticipantStudy[] }> = ({
    studies,
}) => {
    return (
        <Box className="swiper-container">
            <Swiper
                effect='cards'
                slidesPerView='auto'
                cardsEffect={{
                    slideShadows: false,
                    perSlideOffset: 14,
                }}
                centeredSlides
                modules={[EffectCards]}
                style={{ paddingBottom: '2rem', marginBottom: '1rem' }}
                pagination={false}
            >
                {sortAndMapStudies(studies, (study) => (
                    <SwiperSlide key={study.id} className="pb-1">
                        <StudyCard study={study} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export const DesktopStudyCards: FC<{ studies: ParticipantStudy[] }> = ({
    studies,
}) => {
    return (
        <Box className="swiper-container">
            <Swiper
                slidesPerView={3}
                simulateTouch
                freeMode
                style={{
                    marginBottom: '1rem',
                    paddingBottom: '2rem',
                    paddingLeft: '2rem',
                    paddingRight: '2rem',
                }}
                modules={[FreeMode]}
            >
                {sortAndMapStudies(studies, (study) => (
                    <SwiperSlide style={{ padding: '1rem' }} key={study.id}>
                        <StudyCard study={study} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export const StudiesByLearningPath: FC<{
    filteredStudies: ParticipantStudy[];
}> = ({ filteredStudies }) => {
    const [learningPaths, studiesByLearningPath] = useMemo(() => {
        return [
            orderBy(
                uniqBy(
                    filteredStudies.map((fs) => fs.learningPath),
                    (lp) => lp?.label
                ),
                ['completed'],
                ['asc']
            ),
            groupBy(filteredStudies, (study) => study.learningPath?.label),
        ];
    }, [filteredStudies]);

    const isMobile = useIsMobileDevice();

    return (
        <Stack gap="lg" data-testid="studies-listing">
            {learningPaths.map((learningPath) => {
                if (!learningPath) return null;
                const studies = studiesByLearningPath[learningPath.label].sort(
                    (a, b) =>
                        a.completedAt === b.completedAt
                            ? 0
                            : a.completedAt
                                ? 1
                                : -1
                );
                return (
                    <Stack key={learningPath.label}>
                        <Group gap="sm">
                            <Title order={3}>{learningPath.label}</Title>
                            <Text span>|</Text>
                            <Title order={3} fw='300'>
                                {learningPath.description}
                            </Title>
                            {learningPath.completed ? (
                                <Badge color={colors.green}>Completed</Badge>
                            ) : null}
                        </Group>
                        {isMobile ? (
                            <MobileStudyCards studies={studies} />
                        ) : (
                            <DesktopStudyCards studies={studies} />
                        )}
                    </Stack>
                );
            })}
        </Stack>
    );
};

export default LearnerDashboard;
