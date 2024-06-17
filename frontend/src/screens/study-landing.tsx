import React, { useState, useEffect } from "react";
import { Navigate, NavLink, useParams } from "react-router-dom";
import "@mantine/core/styles.css";
import { colors } from "@theme";
import { LandStudyAbortedEnum, LandStudyRequest, ParticipantStudy } from "@api";
import { ErrorPage, LoadingAnimation } from "@components";
import { useApi, useEnvironment, useQueryParam } from "@lib";
import {
    BackgroundImage,
    Box,
    Button,
    Container,
    Flex,
    Group,
    Modal,
    Space,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import Waves from "@images/waves.svg";
import { launchStudy, RewardsSegment, useRewardsSchedule } from "@models";
import { useLandStudy, useParticipantStudies } from "./learner/studies";
import dayjs from "dayjs";
import { showResearcherNotification } from "../components/notifications/researcher-notification";
import { noop } from "lodash-es";

const Points: React.FC<{ study: ParticipantStudy }> = ({ study }) => {
    const completed =
        study.stages?.find((stage) => stage.isCompleted) || study.completedAt;
    if (!completed) return null;

    return (
        <Title order={2} c="white">
            You just earned {study.totalPoints} points!
        </Title>
    );
};

export default function StudyLanding() {
    const { studyId } = useParams<string>();
    const [study, setStudy] = useState<ParticipantStudy | null>(null);
    const env = useEnvironment();

    const [error, setError] = useState<any>(null);
    const consent = useQueryParam("consent") != "false";
    const abort = useQueryParam("abort") == "true";
    const md = useQueryParam("md") || {};
    const { demographicSurvey } = useParticipantStudies();
    const { schedule } = useRewardsSchedule();
    const nextReward = schedule.find(
        (rewardSegment) => !rewardSegment.achieved && rewardSegment.isFuture
    );
    const landStudy = useLandStudy();

    useEffect(() => {
        const params: LandStudyRequest = {
            id: Number(studyId),
            md,
            consent: consent,
        };
        if (abort) {
            params["aborted"] = LandStudyAbortedEnum.Refusedconsent;
        }

        landStudy.mutate(params, {
            onSuccess: (data) => {
                setStudy(data);
                showResearcherNotification(
                    `Way to go, you just earned ${data.totalPoints} points!`
                );
            },
        });
    }, []);

    if (!consent) {
        return <Navigate to="/studies" />;
    }

    if (!study) {
        return <LoadingAnimation message="Loading study" />;
    }

    if (error) {
        return <ErrorPage error={error} />;
    }

    return (
        <Container>
            <Modal
                opened={true}
                onClose={noop}
                centered
                size="75%"
                closeOnClickOutside={false}
                closeOnEscape={false}
                withCloseButton={false}
                styles={{
                    body: {
                        padding: 0,
                    },
                }}
            >
                <BackgroundImage src={Waves}>
                    <Stack
                        gap="xl"
                        p="xl"
                        c="white"
                        data-analytics-view
                        data-analytics-nudge="study-complete"
                        data-nudge-placement="overlay"
                        data-content-tags={`,learning-path=${study.learningPath?.label},is-new-user=${env.isNewUser},`}
                    >
                        <NavLink
                            to={"/studies"}
                            style={{
                                alignSelf: "end",
                                color: "white",
                                fontWeight: "bolder",
                            }}
                            data-testid="view-studies"
                            data-nudge-action="interacted"
                        >
                            Return to Dashboard
                        </NavLink>
                        <Stack gap="xl" w="75%">
                            <Points study={study} />
                            <Text size="xl" pt="xl">
                                You’re one step closer - don’t miss out on the
                                chance to qualify for the next reward cycle!
                            </Text>
                            <NextPrizeCycle nextReward={nextReward} />
                            <CompleteProfilePrompt
                                demographicSurvey={demographicSurvey}
                            />
                            <Space h="xl" />
                        </Stack>
                    </Stack>
                </BackgroundImage>
            </Modal>
        </Container>
    );
}

const NextPrizeCycle: React.FC<{ nextReward: RewardsSegment | undefined }> = ({
    nextReward,
}) => {
    if (!nextReward) return null;

    return (
        <Flex direction="column">
            <Text size="xl" fw="bolder">
                Next Prize Cycle:
            </Text>
            <Text size="xl">
                Reach {nextReward?.points} points by{" "}
                {dayjs(nextReward.endAt).format("MMM D")} and be one of the
                lucky winners to earn {nextReward.prize}
            </Text>
        </Flex>
    );
};

const CompleteProfilePrompt: React.FC<{
    demographicSurvey: ParticipantStudy | null;
}> = ({ demographicSurvey }) => {
    const api = useApi();

    if (!demographicSurvey || !!demographicSurvey.completedAt) return null;

    const onClick = async () => {
        await launchStudy(api, demographicSurvey.id);
    };

    return (
        <Group
            bg={`${colors.gray10}10`}
            p="lg"
            justify="space-between"
            wrap="nowrap"
        >
            <Text>
                <strong>Bonus: </strong>
                <span>
                    Get {demographicSurvey?.totalPoints} points now by simply
                    taking {demographicSurvey?.totalDuration} minutes to
                    complete your Kinetic Profile!
                </span>
            </Text>
            <Box>
                <Button color="blue" c="white" onClick={onClick}>
                    Finish Profile for 10 points
                </Button>
            </Box>
        </Group>
    );
};
