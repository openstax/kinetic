import React, { useCallback, useEffect } from 'react';
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
    textAlign: 'start',
    '@media screen and (max-width: 768px)': {
        flex: '1 1 100%',
        margin: '10px 0',
    },
});

const DoubleSpacedAchievement = styled(Achievement)({
    marginLeft: '173px',
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
});

const AchievementText = styled.p({
    marginBottom: '10px',
    fontSize: '14px',
    whiteSpace: 'pre-line',
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
  height: 50px;
  flex: 1;
`;

const NumberText = styled.div`
  color: ${colors.blue};
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: thin;
  font-size: 50px;
  text-align: center;
`;

const StudyBanner = () => {
    const { filteredStudies } = useSearchStudies();
    const { studies } = useParticipantStudies();
    const navigate = useNavigate();

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

    const hasCompletedStudies = filteredStudies.some(study => study.completedAt);

    const fiveMinuteStudies = filteredStudies.filter(study => study.stages[0]?.durationMinutes === 5);

    const startRandomFiveMinuteStudy = useCallback(() => {
        if (fiveMinuteStudies.length > 0) {
            const randomIndex = Math.floor(Math.random() * fiveMinuteStudies.length);
            const randomStudy = fiveMinuteStudies[randomIndex];
            navigate(`/studies/details/${randomStudy.id}`);
        }
    }, [fiveMinuteStudies, navigate]);

    // Use the `isLoaded` variable to conditionally render content within the component's return statement.
    const isLoaded = studies.length > 0 && filteredStudies.length > 0;

    return isLoaded ? (
        <AchievementsContainer>
            <Achievement>
                <AchievementTitle>Achievements</AchievementTitle>
                <AchievementText>Earn digital badges and additional{'\n'}rewards with OpenStax Kinetic!</AchievementText>
            </Achievement>
            <DoubleSpacedAchievement>
                <AchievementSubtitle>Studies completed</AchievementSubtitle>
                <AchievementText>
                    {hasCompletedStudies ? (
                        <NumberContainer>
                            <NumberText>{totalCompletedCount}</NumberText>
                        </NumberContainer>
                    ) : (
                        <>
                            You haven't completed any studies yet.
                            {'\n'}
                            <HighlightedLink onClick={startRandomFiveMinuteStudy}>
                                Start your first study <IconArrowRight />
                            </HighlightedLink>
                        </>
                    )}
                </AchievementText>
            </DoubleSpacedAchievement>
            <Achievement>
                <AchievementSubtitle>Badges earned</AchievementSubtitle>
                <AchievementText>
                    {hasCompletedStudies ? (
                        <NumberContainer>
                            <NumberText>{badgesEarned}</NumberText>
                        </NumberContainer>
                    ) : (
                        <>
                            Complete all studies in a{'\n'}
                            category to earn your{'\n'}
                            first digital badge.
                        </>
                    )}
                </AchievementText>
            </Achievement>
            <Achievement>
                <AchievementSubtitle>Total points earned</AchievementSubtitle>
                <AchievementText>
                    {hasCompletedStudies ? (
                        <NumberContainer>
                            <NumberText>{totalPointsEarned}</NumberText>
                        </NumberContainer>
                    ) : (
                        <>
                            Reach 200 points to{'\n'}
                            unlock additional{'\n'}
                            educational rewards.
                        </>
                    )}
                </AchievementText>
            </Achievement>
        </AchievementsContainer>
    ) : null;
};

export default StudyBanner;
