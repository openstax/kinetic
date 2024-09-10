import React, { useEffect, useState, ReactNode } from 'react';
import { Stack, Title, Text, Anchor, Group, Container } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowRight } from '@tabler/icons-react';
import { useIsMobileDevice, useIsTabletDevice } from '@lib';
import { useParticipantStudies, filterStudiesBasedOnDuration } from './learner/studies';
import { ParticipantStudy } from '@api';
import { launchStudy } from '@models';
import { useApi } from '@lib';
import { colors } from '@theme';

const BannerSectionTitle: FC<{children: ReactNode}> = ({ children }) => (
    <Title c={colors.text} order={6}>
        {children}
    </Title>
);

const BannerSectionValue: FC<{children: ReactNode}> = ({ children }) => (
    <Text c={colors.purple} size="4.375rem" fw={200}>
        {children}
    </Text>
);

const BannerSectionText: FC<{children: ReactNode}> = ({ children }) => (
    <Text c={colors.text} size="sm">
        {children}
    </Text>
);

const BannerSectionLink: FC<{children: ReactNode, onClick: () => void}> = ({ children, ...props }) => (
    <Anchor c={colors.blue} {...props}>
        <Group gap={0} justify='center' align='center'>
            <Text size="sm" fw={700}>{children}</Text>
            <IconArrowRight size="1.1rem"/>
        </Group>
    </Anchor>
);

const BannerSection: FC<{title: string, mainText: ReactNode, subText?: string, value?: string | number, onClick?: () => void}> = ({ title, mainText, subText, value, onClick }) => {
    const hasValue = value !== undefined;
    const isMobile = useIsMobileDevice()

    return (
        <Stack
            gap={0}
            justify='start'
            align={hasValue? 'center' : 'start'}
            w={isMobile ? '12rem' : '10rem'}
            h="5.75rem"
        >
            <BannerSectionTitle>{title}</BannerSectionTitle>
            {hasValue ? (
                <BannerSectionValue>{value}</BannerSectionValue>
            ) : (
                <>
                    <BannerSectionText>{mainText}</BannerSectionText>
                    {subText && <BannerSectionText>{subText}</BannerSectionText>}
                    {onClick && <BannerSectionLink onClick={onClick}>Start your first study</BannerSectionLink>}
                </>
            )}
        </Stack>
    );
};

const StudyBanner: React.FC = () => {
    const { studies = [] } = useParticipantStudies() as { studies: ParticipantStudy[] };
    const api = useApi();

    const [totalCompletedCount, setTotalCompletedCount] = useState<number>(0);
    const [badgesEarned, setBadgesEarned] = useState<number>(0);
    const [totalPointsEarned, setTotalPointsEarned] = useState<number>(0);

    useEffect(() => {
        if (studies.length > 0) {
            setTotalCompletedCount(studies.filter(study => study.completedAt).length);

            const uniqueCompletedPaths = new Set(
                studies
                    .filter(study => study.learningPath?.completed && study.learningPath.id)
                    .map(study => study.learningPath!.id!.toString())
            );
            setBadgesEarned(uniqueCompletedPaths.size);

            setTotalPointsEarned(
                studies.reduce((sum, study) => sum + (study.completedAt ? (study.totalPoints || 0) : 0), 0)
            );

        }
    }, [studies]);

    const startRandomFiveMinuteStudy = () => {
        const fiveMinuteStudies = filterStudiesBasedOnDuration(studies, new Set<Number>([5])).filter((study) => !study.completedAt)
        if (fiveMinuteStudies.length > 0) {
            const randomStudy = fiveMinuteStudies[Math.floor(Math.random() * fiveMinuteStudies.length)];
            try {
                launchStudy(api, randomStudy.id);
            } catch (error) {
                if (error instanceof Error) {
                    notifications.show({
                        title: 'Failed to launch study',
                        message: error.message,
                        color: 'red',
                    })
                } else {
                    notifications.show({
                        title: 'Failed to launch study',
                        message: 'Unknown Error',
                        color: 'red',
                    })
                }
            }
        }
    }

    const formatValue = (value: number) => value.toString().padStart(2, '0');

    const hasData = totalCompletedCount > 0 || badgesEarned > 0 || totalPointsEarned > 0;
    const isMobile = useIsMobileDevice()
    const isTablet = useIsTabletDevice()

    return (
        <Container pb="2rem" pt="2rem">
            <Group
                justify='space-evenly'
                align='center'
                wrap='wrap'
            >
                <Stack
                    justify='start'
                    align={hasData && isMobile? 'center' : 'start'}
                    ta={hasData && isMobile? 'center': 'left'}
                    w={isMobile ? '12rem' : isTablet ? '10rem' : '16.5rem'}
                    gap={0}
                >
                    <Title order={3}>Achievements</Title>
                    <Text c={colors.text} size="sm">
                    Earn digital badges and additional
                    rewards with OpenStax Kinetic!
                    </Text>
                </Stack>

                <Group gap={isMobile? 'md' : 'xl'} justify='center' align='start'>
                    <BannerSection
                        title="Studies completed"
                        mainText={"You haven't completed any studies yet."}
                        value={hasData ? formatValue(totalCompletedCount) : undefined}
                        onClick={totalPointsEarned === 0 ? startRandomFiveMinuteStudy : () => {}}
                    />

                    <BannerSection
                        title="Badges earned"
                        mainText={'Complete all studies in a category to earn your first digital badge.'}
                        value={hasData ? formatValue(badgesEarned) : undefined}
                    />

                    <BannerSection
                        title="Total points earned"
                        mainText={
                            <>
                                {'Reach 200 points to unlock additional educational rewards'}
                                <br/>
                                <span style={{
                                    fontWeight: 700,
                                    fontStyle: 'italic',
                                }}>{'(coming soon)'}</span>
                            </>
                        }
                        value={hasData ? formatValue(totalPointsEarned) : undefined}
                    />
                </Group>
            </Group>
        </Container>
    );
};

export default StudyBanner;
