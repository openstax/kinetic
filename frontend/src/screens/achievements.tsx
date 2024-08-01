import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Text,
    Button,
    SimpleGrid,
    Container,
    Title,
    Group,
    Loader,
    RingProgress,
    Image,
} from '@mantine/core';
import { TopNavBar, Footer } from '@components';
import { colors } from '@theme';
import { StudyDetailsPreview } from '../screens/learner/details';
import { useParticipantStudies } from './learner/studies';
import { useEnvironment } from '@lib';

interface Study {
    totalPoints: number;
    learningPath?: {
        badge: {
            id: string;
            name: string;
            description: string;
            criteriaHtml: string;
            image: string;
            tags: string[];
        };
        badgeId: string;
        color: string;
        completed: boolean;
        description: string;
        id: number;
        label: string;
        level1Metadata: string[];
        level2Metadata: string[];
        order: number;
        studies: Study[];
    };
}

interface Data {
    studies: Study[];
}


const BadgeDetail = ({
    badge,
    onClose,
}: {
    badge: any;
    onClose: () => void;
}) => {
    const detailRef = useRef<HTMLDivElement | null>(null);
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
        <Box
            ref={detailRef}
            p="md"
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                zIndex: 1001,
                maxWidth: '400px',
                width: '100%',
            }}
        >
            <Button
                onClick={onClose}
                style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
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

const AchievementBadge = ({
    study,
    onBadgeClick,
    onStudySelect,
    user,
}: {
    study: any;
    onBadgeClick: (study: any) => void;
    onStudySelect: (study: any) => void;
    user: { email: string };
}) => {
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

    const handleButtonClick = async (e) => {
        e.stopPropagation();
        if (isCompleted) {
            try {
                // Call your backend endpoint to fetch the certificate URL or the PDF itself
                const response = await fetch(`/api/v1/certificates/${study.learningPath.badgeId}/${user.email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch certificate');
                }

                // Assuming the backend returns a URL to the certificate
                const data = await response.json();
                const certificateUrl = data.certificateUrl;

                // Trigger the download
                const a = document.createElement('a');
                a.href = certificateUrl;
                a.download = 'certificate.pdf';
                a.click();
            } catch (error) {
                console.error('Error downloading certificate:', error);
            }
        } else {
            const nextStudy = study?.learningPath?.studies.find(
                (s) => s.completedCount === 0
            );
            if (nextStudy) {
                onStudySelect(study);
            }
        }
    };

    return (
        <Box
            style={{
                width: 280,
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                margin: '0 20px',
                cursor: 'pointer',
                borderRadius: '8px',
            }}
            onClick={() => onBadgeClick(study)}
        >
            <Box
                style={{
                    width: '100%',
                    height: '280px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                }}
            >
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
                        width: '250px',
                        height: '250px',
                        clipPath:
                            'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                        background: study.learningPath?.badge.image
                            ? 'none'
                            : '#F0F0F0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        src={study.learningPath?.badge.image}
                        alt={`Badge for ${study?.learningPath?.label}`}
                        style={{
                            width: '95%',
                            height: '95%',
                            objectFit: 'contain',
                        }}
                    />
                </Box>
            </Box>
            <Box
                style={{
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '10px',
                    paddingTop: '30px',
                }}
            >
                <Text
                    size="sm"
                    fw={400}
                    mb={4}
                    style={{
                        fontFamily: 'System-ui',
                        fontSize: 16,
                        lineHeight: '24px',
                        textAlign: 'center',
                    }}
                >
                    Learning
                </Text>
                <Text
                    mb={5}
                    style={{
                        fontFamily: 'System-ui',
                        fontSize: 18,
                        fontWeight: 700,
                        lineHeight: '28px',
                        textAlign: 'center',
                    }}
                >
                    {study?.learningPath?.label}
                </Text>
                <Text
                    size="xs"
                    color="dimmed"
                    mb={10}
                    style={{
                        fontFamily: 'System-ui',
                        fontSize: 12,
                        lineHeight: '18px',
                        textAlign: 'center',
                        color: '#848484',
                    }}
                >
                    {`${completedStudies} of ${study?.learningPath?.studies.length}`}
                </Text>
                <Button
                    onClick={handleButtonClick}
                    style={{
                        width: '200px',
                        height: '30px',
                        padding: '8px 20px',
                        gap: '30px',
                        borderRadius: '4px',
                        border: '1px solid #6922EA',
                        backgroundColor: 'white',
                        color: '#6922EA',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {buttonText}
                </Button>
            </Box>
        </Box>
    );
};

const TabButton = ({
    label,
    isActive,
    onClick,
}: {
    label: string;
    isActive: boolean;
    onClick: () => void;
}) => (
    <Button
        variant="subtle"
        color={isActive ? colors.blue : 'black'}
        onClick={onClick}
        style={{
            padding: '8px 16px',
            fontWeight: 500,
            fontSize: '16px',
            textTransform: 'uppercase',
            borderBottom: isActive ? '2px solid #6922EA' : 'none',
            borderRadius: 0,
        }}
    >
        {label}
    </Button>
);


const Achievements = () => {
    const [selectedTab, setSelectedTab] = useState<'Badges' | 'Points'>('Badges');
    const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
    const [selectedStudy, setSelectedStudy] = useState(null);
    const [badgeDetail, setBadgeDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const DATA = useParticipantStudies();

    const env = useEnvironment();
    console.log('Env', env);

    console.log('Data', DATA);

    // Mock user object - replace this with your actual user fetching logic
    const user = { email: 'user@example.com' };

    const handleTabClick = (tab: any) => setSelectedTab(tab);

    const handleBadgeClick = (study: any) => {
        setBadgeDetail(study);
        setSelectedBadge(study.id);
    };

    const handleCloseDetail = () => {
        setBadgeDetail(null);
        setSelectedBadge(null);
    };

    const handleCloseStudyDetails = () => {
        setSelectedStudy(null);
    };

    const handleStudySelect = (study: any) => setSelectedStudy(study);

    const renderContent = () => {
        switch (selectedTab) {
            case 'Badges':
                return (
                    <Box>
                        <Text style={{ marginBottom: '60px', fontSize: '20px' }}>
                            Explore the study paths, track your progress, and access your digital badges.
                        </Text>
                        <SimpleGrid
                            cols={{ base: 1, sm: 2, md: 3 }}
                            spacing={{ base: 40, sm: 60, md: 110 }}
                            style={{
                                marginTop: '100px',
                                padding: {
                                    base: '330px',
                                    sm: '40px',
                                    md: '50px',
                                },
                            }}
                        >
                            {DATA.studies.map((study) => (
                                <AchievementBadge
                                    key={study.id}
                                    study={study}
                                    onBadgeClick={handleBadgeClick}
                                    onStudySelect={handleStudySelect}
                                    user={user} // Pass user as prop
                                />
                            ))}
                        </SimpleGrid>
                        {badgeDetail && (
                            <BadgeDetail
                                badge={badgeDetail}
                                onClose={handleCloseDetail}
                            />
                        )}
                    </Box>
                );
        
            default:
                return null;
        }
    };

    return (
        <Box>
            <TopNavBar />
            <Container size="lg" my="xl">
                <Title mb="xl" mt="lg" order={2}>
                    Achievements
                </Title>
                <Group mb="lg">
                    <TabButton
                        label="Badges"
                        isActive={selectedTab === 'Badges'}
                        onClick={() => handleTabClick('Badges')}
                    />
                    {/* <Divider
                        my="md"
                        size="sm"
                        h={25}
                        style={{ border: "1px solid #255ed3" }}
                    />
                    <TabButton
                        label="Points"
                        isActive={selectedTab === "Points"}
                        onClick={() => handleTabClick("Points")}
                    /> */}
                </Group>
                {isLoading ? (
                    <Loader size="xl" variant="dots" />
                ) : (
                    renderContent()
                )}
            </Container>
            <Footer />
            {selectedStudy && (
                <StudyDetailsPreview
                    study={selectedStudy}
                    show={!!selectedStudy}
                    onHide={handleCloseStudyDetails}
                />
            )}
        </Box>
    );
};

export default Achievements;
