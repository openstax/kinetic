import React, { useCallback, useEffect, useState } from 'react';
import { Box, Title, Text, Anchor, Group, useMantineTheme } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { colors } from '@theme';
import { useSearchStudies, useParticipantStudies } from './learner/studies';

interface Study {
    id: string;
    completedCount?: number;
    learningPath?: {
        completed: boolean;
    };
    totalPoints?: number;
    stages?: { durationMinutes: number }[];
    completedAt?: string;
}

const StudyBanner: React.FC = () => {
    const { filteredStudies } = useSearchStudies();
    const { studies } = useParticipantStudies();
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
    // Simulate learner.tsx being fully rendered
        const timer = setTimeout(() => {
            setIsRendered(true);
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const totalCompletedCount = studies.reduce(
        (sum: number, study: Study) => sum + (study.completedCount || 0),
        0
    );

    const badgesEarned = studies.reduce(
        (count: number, study: Study) => count + (study.learningPath?.completed ? 1 : 0),
        0
    );

    const totalPointsEarned = studies.reduce(
        (sum: number, study: Study) => sum + (study.learningPath?.completed ? (study.totalPoints || 0) : 0),
        0
    );

    const hasCompletedStudies = filteredStudies.some((study: Study) => study.completedAt);

    const fiveMinuteStudies = filteredStudies.filter(
        (study: Study) => study.stages && study.stages[0]?.durationMinutes === 5
    );

    const startRandomFiveMinuteStudy = useCallback(() => {
        if (fiveMinuteStudies.length > 0) {
            const randomIndex = Math.floor(Math.random() * fiveMinuteStudies.length);
            const randomStudy = fiveMinuteStudies[randomIndex];
            navigate(`/studies/details/${randomStudy.id}`);
        }
    }, [fiveMinuteStudies, navigate]);

    const formatValue = (value: number) => (value < 10 ? `0${value}` : value);

    const containerStyle: React.CSSProperties = {
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
    };

    const achievementStyle = (isLeft: boolean): React.CSSProperties => ({
        flex: 1,
        marginRight: isLeft ? '134px' : '0', // 2 * 67px for the "Achievements" component
        marginLeft: '0',
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            flex: '1 1 100%',
            margin: '10px 0',
        },
    });

    const titleStyle: React.CSSProperties = {
        fontWeight: 'bold',
        fontSize: '24px',
        marginBottom: '10px',
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            fontSize: '1.3em',
        },
    };

    const subtitleStyle: React.CSSProperties = {
        fontWeight: 'bold',
        fontSize: '16px',
        marginBottom: '5px',
        textAlign: hasCompletedStudies ? 'center' : 'left',
    };

    const textStyle: React.CSSProperties = {
        marginBottom: '10px',
        fontSize: '14px',
        whiteSpace: 'pre-line',
    };

    const linkStyle: React.CSSProperties = {
        color: colors.blue,
        textDecoration: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '14px',
    };

    const numberContainerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80px',
        flex: 1,
        marginBottom: '10px',
    };

    const numberTextStyle: React.CSSProperties = {
        color: colors.purple,
        fontFamily: 'Helvetica Neue, sans-serif',
        fontWeight: 200,
        fontSize: '70px',
        textAlign: 'center',
    };

    if (!isRendered) {
        return null;
    }

    return (
        <Group align="flex-start" style={containerStyle}>
            <Box style={achievementStyle(true)}>
                <Title order={2} style={titleStyle}>Achievements</Title>
                <Text style={textStyle}>
          Earn digital badges and additional{'\n'}rewards with OpenStax Kinetic!
                </Text>
            </Box>
            <Box style={achievementStyle(false)}>
                <Title order={3} style={subtitleStyle}>
          Studies completed
                </Title>
                {hasCompletedStudies ? (
                    <Box style={numberContainerStyle}>
                        <Text style={numberTextStyle}>{formatValue(totalCompletedCount)}</Text>
                    </Box>
                ) : (
                    <Text style={textStyle}>
            You haven't completed{'\n'}
            any studies yet.{'\n'}

                        <Anchor style={linkStyle} onClick={startRandomFiveMinuteStudy}>
              Start your first study <IconArrowRight />
                        </Anchor>
                    </Text>
                )}
            </Box>
            <Box style={achievementStyle(false)}>
                <Title order={3} style={subtitleStyle}>
          Badges earned
                </Title>
                {hasCompletedStudies ? (
                    <Box style={numberContainerStyle}>
                        <Text style={numberTextStyle}>{formatValue(badgesEarned)}</Text>
                    </Box>
                ) : (
                    <Text style={textStyle}>
            Complete all studies in a{'\n'}
            category to earn your{'\n'}
            first digital badge.
                    </Text>
                )}
            </Box>
            <Box style={achievementStyle(false)}>
                <Title order={3} style={subtitleStyle}>
          Total points earned
                </Title>
                {hasCompletedStudies ? (
                    <Box style={numberContainerStyle}>
                        <Text style={numberTextStyle}>{formatValue(totalPointsEarned)}</Text>
                    </Box>
                ) : (
                    <Text style={textStyle}>
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
