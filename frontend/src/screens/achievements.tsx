import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Text,
    Button,
    SimpleGrid,
    Container,
    Title,
    Tabs,
    RingProgress,
    Image,
} from '@mantine/core';
import { useApi } from '@lib';
import { TopNavBar, Footer } from '@components';
import { colors } from '@theme';
import { StudyDetailsPreview } from '../screens/learner/details';
import { useFetchLearningPaths, useLearningPathStudies } from './learner/studies';
import { useCurrentUser } from '@lib';

const useStyles = () => ({
    badgeDetailContainer: {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        zIndex: 1001,
        maxWidth: '400px',
        width: '100%',
        padding: 'md',
    },
    closeButton: {
        position: 'absolute' as const,
        top: '10px',
        right: '10px',
    },
    achievementBadgeContainer: {
        width: 280,
        height: 400,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative' as const,
        margin: '0 20px',
        cursor: 'pointer',
        borderRadius: '8px',
    },
    errorMessage: {
        color: 'red',
        marginBottom: '10px',
    },
    ringProgressContainer: {
        width: '100%',
        height: '280px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative' as const,
    },
    badgeImageContainer: {
        width: '250px',
        height: '250px',
        clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeImage: {
        width: '95%',
        height: '95%',
        objectFit: 'contain' as const,
    },
    badgeDetails: {
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        padding: '10px',
        paddingTop: '30px',
    },
    learningText: {
        fontFamily: 'Helvetica Neue',
        fontSize: 16,
        lineHeight: '24px',
        textAlign: 'center' as const,
    },
    badgeLabel: {
        fontFamily: 'System-ui',
        fontSize: 18,
        fontWeight: 700,
        lineHeight: '28px',
        textAlign: 'center' as const,
    },
    badgeCompletionText: {
        fontFamily: 'System-ui',
        fontSize: 12,
        lineHeight: '18px',
        textAlign: 'center' as const,
        color: colors.gray70,
    },
    button: {
        width: '200px',
        height: '30px',
        padding: '8px 20px',
        gap: '30px',
        borderRadius: '4px',
        border: `1px solid ${colors.purple}`,
        backgroundColor: 'white',
        color: colors.purple,
        fontSize: '14px',
        fontWeight: 'bold' as const,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabsList: {
        display: 'inline-flex',
        alignItems: 'center',
    },
    tab: {
        color: colors.blue,
        fontSize: '20px',
        fontWeight: 400,
        textTransform: 'uppercase' as const,
        borderBottom: 'none',
        padding: 0,
        marginBottom: '10px',
        marginRight: '20px',
    },
    tabsPanelText: {
        marginBottom: '30px',
        fontSize: '16px',
        color: colors.text,
    },
    simpleGrid: {
        marginTop: '100px',
    },
});

const BadgeDetail = ({
    badge,
    onClose,
}: {
    badge: any;
    onClose: () => void;
}) => {
    const detailRef = useRef<HTMLDivElement | null>(null);
    const styles = useStyles();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                detailRef.current &&
                !detailRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!badge) return null;
    return (
        <Box ref={detailRef} style={styles.badgeDetailContainer}>
            <Button onClick={onClose} style={styles.closeButton}>
                X
            </Button>
            <Title order={3} mb="md">
                {badge?.learningPath?.label}
            </Title>
            <Text mb="md">{badge?.learningPath?.description}</Text>
            <Text size="sm" color="dimmed" mb="md">
                {badge?.learningPath?.level2Metadata
                    .map((item: string) => `#${item}`)
                    .join(', ')}
            </Text>
            {badge?.learningPath?.level2Metadata.map(
                (item: any, index: number) => (
                    <Box key={index} mb="md">
                        <Text fw={600}>{item}</Text>
                        <Text>{item.description}</Text>
                    </Box>
                )
            )}
            <Button fullWidth>Start next study</Button>
        </Box>
    );
};

const convertBase64ToPdf = (base64PDF: string) => {
    const byteCharacters = atob(base64PDF);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return url;
};

const AchievementBadge = ({
    study,
    onBadgeClick,
    onStudySelect,
}: {
    study: any;
    onBadgeClick: (study: any) => void;
    onStudySelect: (study: any) => void;
}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const completedStudies = study?.learningPath?.studies.filter(
        (s: any) => s.completedCount !== 0
    ).length;
    const progress =
        (completedStudies / study?.learningPath?.studies.length) * 100 || 0;
    const isCompleted = progress === 100;
    const buttonText = isCompleted
        ? 'Download Certificate'
        : progress > 0
            ? 'Continue'
            : 'Start';

    const api = useApi();
    const currentUser = useCurrentUser();
    const styles = useStyles();

    const handleButtonClick = async (
        e: React.MouseEvent<HTMLButtonElement>,
        badgeId: string
    ) => {
        e.stopPropagation();
        if (isCompleted) {
            try {
                let userEmail = '';

                if (currentUser && currentUser.contactInfos) {
                    const emailInfo = currentUser.contactInfos.find(
                        (info) => info.type === 'EmailAddress'
                    );
                    if (emailInfo && emailInfo.value) {
                        userEmail = emailInfo.value;
                    }
                }

            } catch (error) {
                setErrorMessage('Error fetching PDF. Please try again later.');
            }
        } else {
            const nextStudy = study?.learningPath?.studies.find(
                (s: any) => s.completedCount === 0
            );
            if (nextStudy) {
                onStudySelect(study);
            }
        }
    };

    return (
        <Box style={styles.achievementBadgeContainer} onClick={() => onBadgeClick(study)}>
            {errorMessage && (
                <Box style={styles.errorMessage}>
                    {errorMessage}
                </Box>
            )}
            <Box style={styles.ringProgressContainer}>
                <RingProgress
                    size={370}
                    thickness={14}
                    sections={[
                        {
                            value: progress,
                            color: isCompleted ? colors.purple : colors.green,
                        },
                    ]}
                    style={{ position: 'absolute' }}
                />
                <Box
                    style={{
                        ...styles.badgeImageContainer,
                        background: study.learningPath?.badge.image
                            ? 'none'
                            : colors.white,
                    }}
                >
                    <Image
                        src={study.learningPath?.badge.image}
                        alt={`Badge for ${study?.learningPath?.label}`}
                        style={styles.badgeImage}
                    />
                </Box>
            </Box>
            <Box style={styles.badgeDetails}>
                <Text
                    size="sm"
                    fw={400}
                    mb={4}
                    style={styles.learningText}
                >
                    Learning
                </Text>
                <Text
                    mb={5}
                    style={styles.badgeLabel}
                >
                    {study?.learningPath?.label}
                </Text>
                <Text
                    size="xs"
                    color="dimmed"
                    mb={10}
                    style={styles.badgeCompletionText}
                >
                    {`${completedStudies} of ${study?.learningPath?.studies.length}`}
                </Text>
                <Button
                    onClick={(e) => handleButtonClick(e, study.learningPath.badgeId)}
                    style={styles.button}
                >
                    {buttonText}
                </Button>
            </Box>
        </Box>
    );
};

const Achievements = () => {
    const [selectedTab, setSelectedTab] = useState('Badges');
    const learningPaths = useLearningPathStudies()

    console.log(learningPaths)

    return (
        <Box>
            <TopNavBar />
            <Container size="lg" my="xl">
                <Title mb="xl" mt="lg" order={2}>
                    Achievements
                </Title>
                <Tabs
                    value={selectedTab}
                    onChange={(value) => setSelectedTab(value as 'Badges')}
                    variant="unstyled"
                >
                    <Tabs.List>
                        <Tabs.Tab value="Badges">
                            BADGES
                        </Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="Badges">
                        <div>Hello</div>
                    </Tabs.Panel>
                </Tabs>
            </Container>
            <Footer />
        </Box>
    );
};

export default Achievements;