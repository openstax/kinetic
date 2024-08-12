import React, { useCallback, useEffect, useState } from 'react';
import { Box, Title, Text, Anchor, Group, useMantineTheme } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useSearchStudies, useParticipantStudies } from './learner/studies';
import { ParticipantStudy } from '@api';

const StudyBanner: React.FC = () => {
    const theme = useMantineTheme();
    const { filteredStudies } = useSearchStudies();
    const { studies = [] } = useParticipantStudies() as { studies: ParticipantStudy[] };
    const navigate = useNavigate();

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

    const containerStyle = {
        padding: '30px',
        borderRadius: theme.radius.md,
        margin: '0 auto',
        maxWidth: '1200px',
        display: 'flex',
        flexWrap: 'wrap' as const,  // Adding 'as const' to resolve the typing issue
    };

    const boxStyle = {
        flex: 1,
        marginRight: Number(theme.spacing.xl) * 2,  // Casting to number to avoid the type error
        marginBottom: '5px',
        display: 'flex',
        flexDirection: 'column' as const,  // Adding 'as const' to resolve the typing issue
    };

    const titleStyle = {
        fontWeight: 700,
        fontSize: theme.fontSizes.lg,
        marginBottom: theme.spacing.sm,
    };

    const textStyle = {
        marginBottom: theme.spacing.sm,
        fontSize: theme.fontSizes.sm,
        whiteSpace: 'pre-line' as const,  // Adding 'as const' to resolve the typing issue
    };

    const valueTextStyle = {
        color: theme.colors.purple[5],
        fontFamily: 'Helvetica Neue, sans-serif',
        fontWeight: 200,
        fontSize: '70px',
        textAlign: 'center' as const,  // Adding 'as const' to resolve the typing issue
    };

    const centerTextStyle = {
        textAlign: 'center' as const,  // Adding 'as const' to resolve the typing issue
    };

    return (
        <Group align="flex-start" style={containerStyle}>
            <Box style={boxStyle}>
                <Title order={2} style={titleStyle}>
          Achievements
                </Title>
                <Text style={textStyle}>
          Earn digital badges and additional{'\n'}rewards with OpenStax Kinetic!
                </Text>
            </Box>
            <Box style={boxStyle}>
                <Title order={3} style={{ ...titleStyle, ...(hasCompletedStudies ? centerTextStyle : {}) }}>
          Studies completed
                </Title>
                {hasCompletedStudies ? (
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px',marginBottom: '10px' }}>
                        <Text style={valueTextStyle}>
                            {formatValue(totalCompletedCount)}
                        </Text>
                    </Box>
                ) : (
                    <Text style={textStyle}>
            You haven't completed{'\n'}
            any studies yet.{'\n'}
                        <Anchor style={{ color: theme.colors.blue[5], textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }} onClick={startRandomFiveMinuteStudy}>
              Start your first study <IconArrowRight />
                        </Anchor>
                    </Text>
                )}
            </Box>
            <Box style={boxStyle}>
                <Title order={3} style={{ ...titleStyle, ...(hasCompletedStudies ? centerTextStyle : {}) }}>
          Badges earned
                </Title>
                {hasCompletedStudies ? (
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px',  marginBottom: '10px' }}>
                        <Text style={valueTextStyle}>
                            {formatValue(badgesEarned)}
                        </Text>
                    </Box>
                ) : (
                    <Text style={textStyle}>
            Complete all studies in a{'\n'}
            category to earn your{'\n'}
            first digital badge.
                    </Text>
                )}
            </Box>
            <Box>
                <Title order={3} style={{ ...titleStyle, ...(hasCompletedStudies ? centerTextStyle : {}) }}>
          Total points earned
                </Title>
                {hasCompletedStudies ? (
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px', marginBottom: '10px' }}>
                        <Text style={valueTextStyle}>
                            {formatValue(totalPointsEarned)}
                        </Text>
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
