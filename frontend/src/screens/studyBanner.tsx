import React, { useCallback, useEffect, useState } from 'react';
import { Box, Title, Text, Anchor, Center, Flex } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useSearchStudies, useParticipantStudies } from './learner/studies';
import { ParticipantStudy } from '@api';

interface BannerSectionProps {
    title: string;
    mainText: string;
    subText?: string;
    value?: string | number;
    hasValue: boolean;
    onClick?: () => void;
}

const BannerSection: React.FC<BannerSectionProps> = ({ title, mainText, subText, value, hasValue, onClick }) => {
    return (
        <Box p="xl" style={{ flex: 1 }} miw='200px' fz='lg'>
            <Title order={3} size='1rem' style={{ textAlign: hasValue ? 'center' : 'left' }}>
                {title}
            </Title>
            {hasValue ? (
                <Center style={{ height: '80px', marginBottom: '10px' }}>
                    <Text color="purple" size="70px" style={{ textAlign: 'center', fontWeight: 200 }}>
                        {value}
                    </Text>
                </Center>
            ) : (
                <>
                    <Text mt="md" size="sm" style={{ textAlign: 'start' }}>
                        {mainText}
                    </Text>
                    {subText && (
                        <Text size="sm" style={{ textAlign: 'start' }}>
                            {subText}
                        </Text>
                    )}
                    {onClick && (
                        <Anchor color="blue" onClick={onClick} style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                            <Text size="sm" style={{ fontSize: '14px', fontWeight: 700 }}> Start your first study </Text>
                            <IconArrowRight style={{ marginLeft: '5px' }} />
                        </Anchor>
                    )}
                </>
            )}
        </Box>
    );
};

const StudyBanner: React.FC = () => {
    const { filteredStudies } = useSearchStudies();
    const { studies = [] } = useParticipantStudies() as { studies: ParticipantStudy[] };
    const navigate = useNavigate();

    const [totalCompletedCount, setTotalCompletedCount] = useState<number>(0);
    const [badgesEarned, setBadgesEarned] = useState<number>(0);
    const [totalPointsEarned, setTotalPointsEarned] = useState<number>(0);
    const [hasCompletedStudies, setHasCompletedStudies] = useState<boolean>(false);
    const [fiveMinuteStudies, setFiveMinuteStudies] = useState<ParticipantStudy[]>([]);
    const [dataFetched, setDataFetched] = useState<boolean>(false);

    useEffect(() => {
        if (studies.length > 0 || filteredStudies.length > 0) {
            setTotalCompletedCount(studies.reduce((sum, study) => sum + (study.completedCount || 0), 0));
            setBadgesEarned(studies.reduce((count, study) => count + (study.learningPath?.completed ? 1 : 0), 0));
            setTotalPointsEarned(studies.reduce((sum, study) => sum + (study.learningPath?.completed ? (study.totalPoints || 0) : 0), 0));
            setHasCompletedStudies(filteredStudies.some((study) => study.completedAt !== undefined));
            setFiveMinuteStudies(filteredStudies.filter((study) => study.stages && study.stages[0]?.durationMinutes === 5));
            setDataFetched(true);
        }
    }, [studies, filteredStudies]);

    const startRandomFiveMinuteStudy = useCallback(() => {
        if (fiveMinuteStudies.length > 0) {
            const randomIndex = Math.floor(Math.random() * fiveMinuteStudies.length);
            const randomStudy = fiveMinuteStudies[randomIndex];
            navigate(`/studies/details/${randomStudy.id}`);
        }
    }, [fiveMinuteStudies, navigate]);

    const formatValue = (value: number) => (value < 10 ? `0${value}` : value);

    if (!dataFetched) {
        return null;
    }

    return (
        <Flex
            mt='0.5rem'
            justify='center'
            align='center'
            wrap='wrap'
            gap='1rem'
            w='65%'
            mx='auto'
        >
            <Box p="xl" style={{ flex: 1, marginRight: '8rem' }} miw='200px' fz='lg'>
                <Title order={2} mb="sm" style={{ fontSize: '24px', fontWeight: 700 }}>
                    Achievements
                </Title>
                <Text mb="sm" size="sm" style={{ whiteSpace: 'pre-line' }}>
                    Earn digital badges and additional {'\n'}
                    rewards with OpenStax Kinetic!
                </Text>
            </Box>

            <BannerSection
                title="Studies completed"
                mainText="You haven't completed"
                subText="any studies yet."
                value={formatValue(totalCompletedCount)}
                hasValue={hasCompletedStudies}
                onClick={startRandomFiveMinuteStudy}
            />

            <BannerSection
                title="Badges earned"
                mainText="Complete all studies in a"
                subText="category to earn your first digital badge."
                value={formatValue(badgesEarned)}
                hasValue={hasCompletedStudies}
            />

            <BannerSection
                title="Total points earned"
                mainText="Reach 200 points to"
                subText="unlock additional educational rewards."
                value={formatValue(totalPointsEarned)}
                hasValue={hasCompletedStudies}
            />
        </Flex>
    );
};

export default StudyBanner;
