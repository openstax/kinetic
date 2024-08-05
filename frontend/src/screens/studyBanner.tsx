import React, { useCallback, useState, useEffect } from 'react';
import { styled } from '@common';
import { colors } from '@theme';
import { useSearchStudies, useParticipantStudies } from './learner/studies';
import { IconArrowRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const AchievementsContainer = styled.div({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '30px',
    borderRadius: '8px',
    margin: '0 auto',
    maxWidth: '1200px',
    '@media screen and (max-width: 768px)': {
        flexDirection: 'column',
        padding: '20px',
        margin: '0 1%',
    },
});

const Achievement = styled.div({
    flex: '1',
    margin: '0 15px',
    '@media screen and (max-width: 768px)': {
        flex: '1 1 100%',
        margin: '10px 0',
    },
});

const AchievementTitle = styled.h2({
    fontWeight: 'bold',
    fontSize: '24px',
    marginBottom: '10px',
    '@media screen and (max-width: 768px)': {
        fontSize: '1.3em',
    },
});

const AchievementSubtitle = styled.h3({
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '5px',
    textAlign: 'center',
});

const AchievementText = styled.p({
    marginBottom: '10px',
    fontSize: '14px',
    whiteSpace: 'pre-line',
    textAlign: 'left',
});

const HighlightedLink = styled.a({
    color: colors.blue,
    textDecoration: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
    ':hover': {
        textDecoration: 'underline',
    },
});

const NumberContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90px;
  flex: 1;
  margin-bottom: 5px;
`;

const NumberText = styled.div`
  color: ${colors.purple};
  font-family: sans-serif;
  font-weight: lighter;
  font-size: 60px;
  text-align: center;
`;

const StudyBanner = () => {
    const { filteredStudies } = useSearchStudies();
    const { studies } = useParticipantStudies();
    const navigate = useNavigate();
    const [hasStartedStudy, setHasStartedStudy] = useState(false);

    useEffect(() => {
        setHasStartedStudy(studies.length > 0);
    }, [studies]);

    const totalCompletedCount = studies.reduce(
        (sum, study) => sum + (study.completedCount || 0),
        0
    );

    const badgesEarned = studies.reduce(
        (count, study) => count + (study.learningPath?.completed ? 1 : 0),
        0
    );

    const totalPointsEarned = studies.reduce(
        (sum, study) => sum + (study.learningPath?.completed ? (study.totalPoints || 0) : 0),
        0
    );

    const fiveMinuteStudies = filteredStudies.filter(study => study.stages[0]?.durationMinutes === 5);

    const startRandomFiveMinuteStudy = useCallback(() => {
        if (fiveMinuteStudies.length > 0) {
            const randomIndex = Math.floor(Math.random() * fiveMinuteStudies.length);
            const randomStudy = fiveMinuteStudies[randomIndex];
            navigate(`/studies/details/${randomStudy.id}`);
        }
    }, [fiveMinuteStudies, navigate]);

    return (
        <AchievementsContainer>
            <Achievement>
                <AchievementTitle>Achievements</AchievementTitle>
                <AchievementText>Earn digital badges and additional{'\n'}rewards with OpenStax Kinetic!</AchievementText>
            </Achievement>
            <Achievement>
                <AchievementSubtitle>Studies completed</AchievementSubtitle>
                {hasStartedStudy ? (
                    <NumberContainer>
                        <NumberText>{totalCompletedCount}</NumberText>
                    </NumberContainer>
                ) : (
                    <AchievementText style={{ display: 'none' }}>
                        You haven't completed any studies yet.
                        {'\n'}
                        <HighlightedLink onClick={startRandomFiveMinuteStudy}>
                            Start your first study <IconArrowRight />
                        </HighlightedLink>
                    </AchievementText>
                )}
            </Achievement>
            <Achievement>
                <AchievementSubtitle>Badges earned</AchievementSubtitle>
                {hasStartedStudy ? (
                    <NumberContainer>
                        <NumberText>{badgesEarned}</NumberText>
                    </NumberContainer>
                ) : (
                    <AchievementText style={{ display: 'none' }}>
                        Complete all studies in a{'\n'}
                        category to earn your{'\n'}
                        first digital badge.
                    </AchievementText>
                )}
            </Achievement>
            <Achievement>
                <AchievementSubtitle>Total points earned</AchievementSubtitle>
                {hasStartedStudy ? (
                    <NumberContainer>
                        <NumberText>{totalPointsEarned}</NumberText>
                    </NumberContainer>
                ) : (
                    <AchievementText style={{ display: 'none' }}>
                        Reach 200 points to{'\n'}
                        unlock additional{'\n'}
                        educational rewards.
                    </AchievementText>
                )}
            </Achievement>
        </AchievementsContainer>
    );
};

export default StudyBanner;