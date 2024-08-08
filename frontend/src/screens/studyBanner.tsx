import React, { useCallback, useEffect, useState } from 'react';
import { Box, Title, Text, Anchor, Group, useMantineTheme } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { colors } from '@theme';
import { useSearchStudies, useParticipantStudies } from './learner/studies';
import { ParticipantStudy } from '@api';


const StudyBanner: React.FC = () => {
    const { filteredStudies } = useSearchStudies();
    const { studies = [] } = useParticipantStudies() as { studies: ParticipantStudy[] };
    const navigate = useNavigate();
    const theme = useMantineTheme();

    const [totalCompletedCount, setTotalCompletedCount] = useState<number>(0);
    const [badgesEarned, setBadgesEarned] = useState<number>(0);
    const [totalPointsEarned, setTotalPointsEarned] = useState<number>(0);
    const [hasCompletedStudies, setHasCompletedStudies] = useState<boolean>(false);
    const [fiveMinuteStudies, setFiveMinuteStudies] = useState<ParticipantStudy[]>([]);

    useEffect(() => {
        setTotalCompletedCount(studies.reduce((sum, study) => sum + (study.completedCount || 0), 0));
        setBadgesEarned(studies.reduce((count, study) => count + (study.learningPath?.completed ? 1 : 0), 0));
        setTotalPointsEarned(studies.reduce((sum, study) => sum + (study.learningPath?.completed ? (study.totalPoints || 0) : 0), 0));
        setHasCompletedStudies(filteredStudies.some((study) => study.completedAt !== undefined));
        setFiveMinuteStudies(filteredStudies.filter((study) => study.stages && study.stages[0]?.durationMinutes === 5));
    }, [studies, filteredStudies]);

    const startRandomFiveMinuteStudy = useCallback(() => {
        if (fiveMinuteStudies.length > 0) {
            const randomIndex = Math.floor(Math.random() * fiveMinuteStudies.length);
            const randomStudy = fiveMinuteStudies[randomIndex];
            navigate(`/studies/details/${randomStudy.id}`);
        }
    }, [fiveMinuteStudies, navigate]);

    const formatValue = (value: number) => (value < 10 ? `0${value}` : value);

    return (
        <Group
            align="flex-start"
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '30px',
                borderRadius: '8px',
                margin: '0 auto',
                maxWidth: '1200px',
                [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                    flexDirection: 'column',
                    padding: '20px',
                    margin: '0 1%',
                },
            }}
        >
            <Box
                style={{
                    flex: 1,
                    marginRight: '134px',
                    marginLeft: '0',
                    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                        flex: '1 1 100%',
                        margin: '10px 0',
                    },
                }}
            >
                <Title order={2} style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '10px', [`@media (max-width: ${theme.breakpoints.sm}px)`]: { fontSize: '1.3em' } }}>
                    Achievements
                </Title>
                <Text style={{ marginBottom: '10px', fontSize: '14px', whiteSpace: 'pre-line' }}>
                    Earn digital badges and additional{'\n'}rewards with OpenStax Kinetic!
                </Text>
            </Box>
            <Box
                style={{
                    flex: 1,
                    marginLeft: '0',
                    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                        flex: '1 1 100%',
                        margin: '10px 0',
                    },
                }}
            >
                <Title order={3} style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px', textAlign: hasCompletedStudies ? 'center' : 'left' }}>
                    Studies completed
                </Title>
                {hasCompletedStudies ? (
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px', flex: 1, marginBottom: '10px' }}>
                        <Text style={{ color: colors.purple, fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 200, fontSize: '70px', textAlign: 'center' }}>
                            {formatValue(totalCompletedCount)}
                        </Text>
                    </Box>
                ) : (
                    <Text style={{ marginBottom: '10px', fontSize: '14px', whiteSpace: 'pre-line' }}>
                        You haven't completed{'\n'}
                        any studies yet.{'\n'}
                        <Anchor style={{ color: colors.blue, textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }} onClick={startRandomFiveMinuteStudy}>
                            Start your first study <IconArrowRight />
                        </Anchor>
                    </Text>
                )}
            </Box>
            <Box
                style={{
                    flex: 1,
                    marginLeft: '0',
                    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                        flex: '1 1 100%',
                        margin: '10px 0',
                    },
                }}
            >
                <Title order={3} style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px', textAlign: hasCompletedStudies ? 'center' : 'left' }}>
                    Badges earned
                </Title>
                {hasCompletedStudies ? (
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px', flex: 1, marginBottom: '10px' }}>
                        <Text style={{ color: colors.purple, fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 200, fontSize: '70px', textAlign: 'center' }}>
                            {formatValue(badgesEarned)}
                        </Text>
                    </Box>
                ) : (
                    <Text style={{ marginBottom: '10px', fontSize: '14px', whiteSpace: 'pre-line' }}>
                        Complete all studies in a{'\n'}
                        category to earn your{'\n'}
                        first digital badge.
                    </Text>
                )}
            </Box>
            <Box
                style={{
                    flex: 1,
                    marginLeft: '0',
                    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                        flex: '1 1 100%',
                        margin: '10px 0',
                    },
                }}
            >
                <Title order={3} style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px', textAlign: hasCompletedStudies ? 'center' : 'left' }}>
                    Total points earned
                </Title>
                {hasCompletedStudies ? (
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px', flex: 1, marginBottom: '10px' }}>
                        <Text style={{ color: colors.purple, fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 200, fontSize: '70px', textAlign: 'center' }}>
                            {formatValue(totalPointsEarned)}
                        </Text>
                    </Box>
                ) : (
                    <Text style={{ marginBottom: '10px', fontSize: '14px', whiteSpace: 'pre-line' }}>
                        Reach 200 points to{'\n'}
                        unlock additional{'\n'}
                        educational rewards.
                    </Text>
                )}
            </Box>
        </Group>
    );
};

export default StudyBanner;
