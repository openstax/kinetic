import React, { useCallback, useEffect, useState, ReactNode } from 'react';
import { Stack, Title, Text, Anchor, Center, Group, TitleProps, TextProps, AnchorProps } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useSearchStudies, useParticipantStudies } from './learner/studies';
import { ParticipantStudy } from '@api';
import { launchStudy, isMultiSession, getNextAvailableStage } from '@models';
import { useApi } from '@lib';
import { colors } from '@theme';

interface BannerSectionTitleProps extends TitleProps {
    hasValue?: boolean;
    children: ReactNode;
}

const BannerSectionTitle: React.FC<BannerSectionTitleProps> = ({ hasValue, children, ...props }) => (
    <Title c={colors.text} order={3} size='1rem' mb='-0.25rem' ta={hasValue ? 'center' : 'left'} {...props}>
        {children}
    </Title>
);

interface CustomTextProps extends TextProps {
    children: ReactNode;
}

const BannerSectionValue: React.FC<CustomTextProps> = ({ children }) => (
    <Text color="purple" size="4.375rem" fw={200} ta={'center'} lh={1.1} mt={'0.125rem'} >
        {children}
    </Text>
);

const BannerSectionText: React.FC<CustomTextProps> = ({ children, ...props }) => (
    <Text c={colors.text} size="sm" mt={'0.5rem'} lh={1.2} maw={'12.5rem'} style={{  whiteSpace: 'pre-line' }} {...props}>
        {children}
    </Text>
);

interface CustomAnchorProps extends AnchorProps {
    children: ReactNode;
    onClick?: () => void;
}

const BannerSectionLink: React.FC<CustomAnchorProps> = ({ children, ...props }) => (
    <Anchor c={colors.blue} style={{ display: 'flex', alignItems: 'center', marginTop: '0.3125rem' }} {...props}>
        <Text size="sm" fw={700} >{children}</Text>
        <IconArrowRight style={{ marginLeft: '0.3125rem' }} />
    </Anchor>
);

interface BannerSectionProps {
    title: string;
    mainText: string;
    subText?: string;
    value?: string | number;
    onClick?: () => void;
}

const BannerSection: React.FC<BannerSectionProps> = ({ title, mainText, subText, value, onClick }) => {
    const hasValue = value !== undefined && Number(value) > 0;

    return (
        <Stack
            gap={0}
            justify={hasValue ? 'center' : 'start'}
            align={hasValue ? 'center' : 'start'}
            miw={'12.5rem'}
            maw={'18.75rem'}
            ta={'start'}
            ml={'1rem'}
            h={'6.875rem'}
        >
            <BannerSectionTitle hasValue={hasValue}>{title}</BannerSectionTitle>
            {hasValue ? (
                <Center h={'5rem'} mb={'0.625rem'} >
                    <BannerSectionValue>{value}</BannerSectionValue>
                </Center>
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
    const { filteredStudies } = useSearchStudies();
    const { studies = [] } = useParticipantStudies() as { studies: ParticipantStudy[] };
    const api = useApi();

    const [totalCompletedCount, setTotalCompletedCount] = useState<number>(0);
    const [badgesEarned, setBadgesEarned] = useState<number>(0);
    const [totalPointsEarned, setTotalPointsEarned] = useState<number>(0);
    const [fiveMinuteStudies, setFiveMinuteStudies] = useState<ParticipantStudy[]>([]);

    useEffect(() => {
        if (studies.length > 0 || filteredStudies.length > 0) {
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

            setFiveMinuteStudies(filteredStudies.filter(study =>
                (study.stages && study.stages[0]?.durationMinutes === 5) ||
                (!isMultiSession(study) && study.totalDuration === 5) ||
                (isMultiSession(study) && getNextAvailableStage(study)?.durationMinutes === 5)
            ));
        }
    }, [studies, filteredStudies]);

    const startRandomFiveMinuteStudy = useCallback(async () => {
        if (fiveMinuteStudies.length > 0) {
            const randomStudy = fiveMinuteStudies[Math.floor(Math.random() * fiveMinuteStudies.length)];
            try {
                await launchStudy(api, randomStudy.id);
            } catch (error) {
            }
        }
    }, [fiveMinuteStudies, api]);

    const formatValue = (value: number) => value.toString().padStart(2, '0');

    return (
        <Group
            mt='0.1rem'
            justify='center'
            align='center'
            wrap='wrap'
            gap='1rem'
            mx='auto'
            w={'100%'}
            h={'10.5rem'}
            maw={'75rem'}
        >
            <Stack 
                p="xl" 
                mt={'-1.25rem'}
                justify='center'
                flex={1}
                miw={'15.625rem'}
                maw={'25rem'}
                fz='lg'
            >
                <Title order={2} style={{ fontSize: '1.5rem' }}>Achievements</Title>
                <Text c={colors.text} size="sm" style={{ whiteSpace: 'pre-line', marginTop: '-0.9375rem' }}>
                    Earn digital badges and additional {'\n'}
                    rewards with OpenStax Kinetic!
                </Text>
            </Stack>

            <BannerSection
                title="Studies completed"
                mainText={"You haven't completed\nany studies yet."}
                value={formatValue(totalCompletedCount)}
                onClick={totalPointsEarned === 0 ? startRandomFiveMinuteStudy : undefined}
            />

            <BannerSection
                title="Badges earned"
                mainText={'Complete all studies in a\ncategory to earn your\nfirst digital badge.'}
                value={formatValue(badgesEarned)}
            />

            <BannerSection
                title="Total points earned"
                mainText={'Reach 200 points to\nunlock additional\neducational rewards.'}
                value={formatValue(totalPointsEarned)}
            />
        </Group>
    );
};

export default StudyBanner;
