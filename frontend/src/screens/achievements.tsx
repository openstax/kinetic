import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Text,
    Button,
    SimpleGrid,
    Container,
    Title,
    Group,
    Loader,
    Progress,
    RingProgress,
    Image,
} from "@mantine/core";
import { TopNavBar, Footer } from "@components";
import { colors } from "@theme";
import { StudyDetailsPreview } from "../screens/learner/details";
import RewardsSection from "./RewardSection";
import PointsHistory from "./PointsHistory";

import { useParticipantStudies } from "./learner/studies";

import { useFetchRewards } from "../models/rewards";

const activities = [
    {
        activity: "Points earned",
        studyName: "So what is financial aid, anyway?",
        feedback: "Available",
        date: "03/03/2024",
        balance: 150,
    },
    {
        activity: "Points earned",
        studyName: "How many letters can you remember?",
        feedback: "Available",
        date: "02/28/2024",
        balance: 100,
    },
    {
        activity: "Points Redeemed",
        studyName: "Essay feedback session, Dr. Debshilla Basu",
        feedback: "N/A",
        date: "01/12/2024",
        balance: -200,
    },
    {
        activity: "Points earned",
        studyName: "Uncover your achievement & learning goals",
        feedback: "Available",
        date: "12/17/2024",
        balance: 250,
    },
    {
        activity: "Points earned",
        studyName: "What are your ability beliefs?",
        feedback: "Available",
        date: "10/09/2023",
        balance: 180,
    },
    {
        activity: "Points earned",
        studyName: "Do you procrastinate?",
        feedback: "Available",
        date: "09/18/2023",
        balance: 100,
    },
    {
        activity: "Points earned",
        studyName: "Does creating personal connections help you...?",
        feedback: "Available",
        date: "08/15/2023",
        balance: 60,
    },
    {
        activity: "Points earned",
        studyName: "What are your core personality traits?",
        feedback: "Available",
        date: "06/24/2023",
        balance: 40,
    },
];
const dummyData = {
    studies: [
        {
            id: 1,
            titleForParticipants: "Study 1",
            totalPoints: 20,
            completedAt: new Date("2024-07-07T05:49:52.000Z"),
        },
        {
            id: 3,
            titleForParticipants: "Study 2",
            totalPoints: 10,
            completedAt: new Date("2024-07-07T06:02:05.000Z"),
        },
    ],
    welcomeStudies: [
        {
            id: 2,
            titleForParticipants: "Welcome Study 1",
            totalPoints: 5,
            completedAt: new Date("2024-07-06T15:30:00.000Z"),
        },
        {
            id: 4,
            titleForParticipants: "Welcome Study 2",
            totalPoints: 5,
            completedAt: new Date("2024-07-06T16:45:00.000Z"),
        },
    ],
};

function getTotalPoints(data) {
    const studyPoints = data.studies.reduce(
        (sum, study) => sum + study.totalPoints,
        0
    );
    const welcomeStudyPoints = data.welcomeStudies.reduce(
        (sum, study) => sum + study.totalPoints,
        0
    );
    return studyPoints + welcomeStudyPoints;
}

const pointsEarned = getTotalPoints(dummyData);
const totalPoints = 100;

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

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    if (!badge) return null;
    return (
        <Box
            ref={detailRef}
            p="md"
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                zIndex: 1001,
                maxWidth: "400px",
                width: "100%",
            }}
        >
            <Button
                onClick={onClose}
                style={{ position: "absolute", top: "10px", right: "10px" }}
            >
                X
            </Button>
            <Title order={3} mb="md">
                {badge.learningPath.label}
            </Title>
            <Text mb="md">{badge.learningPath.description}</Text>
            <Text size="sm" color="dimmed" mb="md">
                {badge.learningPath.level2Metadata
                    .map((item: string) => `#${item}`)
                    .join(", ")}
            </Text>
            {badge.learningPath.level2Metadata.map(
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
}: {
    study: any;
    onBadgeClick: (study: any) => void;
    onStudySelect: (study: any) => void;
}) => {
    const completedStudies = study.learningPath.studies.filter(
        (s: any) => s.completedCount !== 0
    ).length;
    const progress =
        (completedStudies / study.learningPath.studies.length) * 100 || 0;
    const isCompleted = progress === 100;
    const buttonText = isCompleted
        ? "Download Certificate"
        : progress > 0
        ? "Continue"
        : "Start";

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isCompleted) {
            return `Downloading certificate for ${study.learningPath.label}`;
        } else {
            const nextStudy = study.learningPath.studies.find(
                (s: any) => s.completedCount === 0
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                margin: "0 20px",
                cursor: "pointer",
                // border: isSelected ? "2px solid #6922EA" : "none",
                borderRadius: "8px",
            }}
            onClick={() => onBadgeClick(study)}
        >
            <Box
                style={{
                    width: "100%",
                    height: "280px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <RingProgress
                    size={350}
                    thickness={14}
                    sections={[
                        {
                            value: progress,
                            color: isCompleted ? colors.purple : colors.green,
                        },
                    ]}
                    style={{ position: "absolute" }}
                />
                <Box
                    style={{
                        width: "220px",
                        height: "220px",
                        clipPath:
                            "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                        background: "#F0F0F0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Image
                        src={study.learningPath?.badge?.image}
                        alt={`Badge for ${study.learningPath?.label}`}
                        style={{
                            width: "80%",
                            height: "80%",
                            objectFit: "contain",
                        }}
                    />
                </Box>
            </Box>
            <Box
                style={{
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Text
                    size="sm"
                    fw={400}
                    mb={4}
                    style={{
                        fontFamily: "System-ui",
                        fontSize: 16,
                        lineHeight: "24px",
                        textAlign: "center",
                    }}
                >
                    Learning
                </Text>
                <Text
                    mb={2}
                    style={{
                        fontFamily: "System-ui",
                        fontSize: 18,
                        fontWeight: 700,
                        lineHeight: "28px",
                        textAlign: "center",
                    }}
                >
                    {study.learningPath.label}
                </Text>
                <Text
                    size="xs"
                    color="dimmed"
                    mb={10}
                    style={{
                        fontFamily: "System-ui",
                        fontSize: 12,
                        lineHeight: "18px",
                        textAlign: "center",
                        color: "#848484",
                    }}
                >
                    {`${completedStudies} of ${study.learningPath?.studies.length}`}
                </Text>
                <Button
                    onClick={handleButtonClick}
                    style={{
                        width: "200px",
                        height: "30px",
                        padding: "8px 20px",
                        gap: "30px",
                        borderRadius: "4px",
                        border: "1px solid #6922EA",
                        backgroundColor: "white",
                        color: "#6922EA",
                        fontSize: "14px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
        color={isActive ? colors.blue : "black"}
        onClick={onClick}
        style={{
            padding: "8px 16px",
            fontWeight: 500,
            fontSize: "16px",
            textTransform: "uppercase",
            borderBottom: isActive ? "2px solid #6922EA" : "none",
            borderRadius: 0,
        }}
    >
        {label}
    </Button>
);

const PointsProgressBar = ({
    pointsEarned,
    totalPoints,
    nextRewardPoints,
}: {
    pointsEarned: number;
    totalPoints: number;
    nextRewardPoints: number;
}) => (
    <Box mb="xl" mt="50px">
        <h2 style={{ marginBottom: "30px", fontWeight: "bold" }}>
            Current Points
        </h2>

        <Text fw={700} mb="xs" style={{ color: "#3d2dcb" }} ml="xl">
            To unlock additional rewards, reach {nextRewardPoints} points!
        </Text>
        <p style={{ color: "#3d2dcb", marginLeft: "30px" }}>
            Remember, the longer the study, the more points you earn.
        </p>
        <Progress
            value={(pointsEarned / totalPoints) * 100}
            color={pointsEarned < nextRewardPoints ? "blue" : "#0EE094"}
            size="xl"
            mb="xs"
            ml="xl"
        />
        <Text size="sm" color="dimmed" ml="xl">
            {pointsEarned} of {totalPoints} points
        </Text>
    </Box>
);

const Achievements = () => {
    const [selectedTab, setSelectedTab] = useState<"Badges" | "Points">(
        "Badges"
    );
    const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
    const [selectedStudy, setSelectedStudy] = useState(null);
    const [badgeDetail, setBadgeDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const DATA = useParticipantStudies();

    const { data: rewards = [] } = useFetchRewards();

    console.log("Data", DATA);

    console.log("Rewards", rewards);

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
            case "Badges":
                return (
                    <Box>
                        <Text style={{ marginBottom: "30px" }}>
                            Explore the study paths, track your progress, and
                            access your digital badges.
                        </Text>
                        <SimpleGrid
                            cols={3}
                            spacing={80}
                            // @ts-ignore
                            breakpoints={[
                                { maxWidth: "md", cols: 1 },
                                { maxWidth: "lg", cols: 2 },
                            ]}
                        >
                            {DATA.studies.map((study) => (
                                <AchievementBadge
                                    key={study.id}
                                    study={study}
                                    onBadgeClick={handleBadgeClick}
                                    // isSelected={selectedBadge === study.id}
                                    onStudySelect={handleStudySelect}
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
            case "Points":
                return (
                    <Box>
                        <Text style={{ marginBottom: "30px" }}>
                            Unlock educational rewards, review your points
                            history, and access study feedback.
                        </Text>
                        <PointsProgressBar
                            pointsEarned={pointsEarned}
                            totalPoints={totalPoints}
                            nextRewardPoints={200}
                        />
                        <RewardsSection />
                        <PointsHistory activities={activities} />
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
                        isActive={selectedTab === "Badges"}
                        onClick={() => handleTabClick("Badges")}
                    />
                    <TabButton
                        label="Points"
                        isActive={selectedTab === "Points"}
                        onClick={() => handleTabClick("Points")}
                    />
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
