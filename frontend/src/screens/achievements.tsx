import React, { useState, useEffect } from 'react';
import {
    Box,
    Text,
    Button,
    Container,
    Title,
    Tabs,
    RingProgress,
    Image,
    Group,
    Stack,
    Flex,
    Modal
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useApi } from '@lib';
import { launchStudy } from '@models';
import { TopNavBar, Footer } from '@components';
import { colors } from '@theme';
import { StudyDetailsPreview } from '../screens/learner/details';
import { useFetchLearningPaths } from './learner/studies';
import { useCurrentUser } from '@lib';
import { ParticipantStudy } from '@api';


const BadgeDetails:FC<{opened: boolean}> = ({opened}) => {
    return(
        <Modal opened={opened} onClose={close} title="Authentication" centered>

        </Modal>
    )
}
const AchievementBadge:FC<{learningPath: string; studies: ParticipantStudy[]}> = ({learningPath, studies}) => {

    console.log(studies[0].learningPath?.badge)
    const api = useApi()
    const [progress, setProgress] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [completedStudies, setCompletedStudies] = useState<ParticipantStudy[]>([])
    const [btnText, setBtnText] = useState("Start")
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        setCompletedStudies(studies.filter((study: ParticipantStudy) => study.completedAt))
    }, [studies])

    useEffect(() => {
        setProgress((completedStudies.length / studies.length) * 100)
        setIsComplete(completedStudies.length == studies.length)
    }, [completedStudies, isComplete])

    useEffect(() => {
        setBtnText(() => {
            if(isComplete){
                return "Download Certificate"
            }

            if(completedStudies.length > 0){
                return "Continue"
            }

            return "Start"
        })
    }, [completedStudies, isComplete])

    const handleButtonClick = () => {
        if(!isComplete){
            const incompleteStudy = studies.find((study) => !study.completedAt)
            if(incompleteStudy){
                launchStudy(api, incompleteStudy.id)
            }
        }       
    }
    return(
        <Stack>
            <Modal opened={opened} onClose={close} title="Authentication" centered>
            </Modal>
            <RingProgress
                size={350}
                thickness={20}
                sections={[{ value: progress, color: isComplete ? colors.purple : colors.green }]}
                label={
                    <Group justify='center' align='center'>
                        <Group justify='center' align='center' w={230} h={230} style={{overflow: 'hidden', borderRadius: '100%'}}>
                            <Image src={studies[0].learningPath?.badge?.image} w={230} h="auto"/>
                        </Group>
                    </Group>
                }
                onClick={open}
                style={{ cursor: 'pointer' }}
            />
            <Stack justify='center' align='center' mt={-30} pb={40}>
                <Flex justify='center' align='center' gap="0" direction='column'>
                    <Text size='md'>Learning</Text>
                    <Text size='lg' fw={700}>{learningPath}</Text>
                    <Text size='xs' c={colors.gray70}>{completedStudies.length} of {studies.length}</Text>
                </Flex>
                
                <Button onClick={() => handleButtonClick()} variant='outline' c={colors.btnPurple} pl={35} pr={35} style={{ border: `1px solid ${colors.purple}`}}>{btnText}</Button>
            </Stack>
        </Stack>
    )
}

const Achievements:FC = () => {
    const [selectedTab, setSelectedTab] = useState('Badges');
    const learningPaths = useFetchLearningPaths()

    return (
        <Box>
            <TopNavBar />
            <Container size="lg" my="xl">
                <Title mb="lg" mt="lg" order={2}>
                    Achievements
                </Title>
                <Tabs
                    value={selectedTab}
                    onChange={(value) => setSelectedTab(value as 'Badges')}
                    variant="unstyled"
                >
                    <Tabs.List c={ colors.blue } ml={-16}>
                        <Tabs.Tab value="Badges">
                            <Text size='xl'>BADGES</Text>
                        </Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="Badges">
                        <Stack c={colors.text} >
                            <Text>Explore the study paths, track your progress, and access your digital badges.</Text>
                            <Group gap="xs" justify='flex-start' align='center'>
                                {Object.entries(learningPaths).map(([learningPath, studies]) => {
                                    console.log(studies)
                                    return <AchievementBadge key={learningPath} learningPath={learningPath} studies={studies}/>
                                })}
                            </Group>
                        </Stack>
                    </Tabs.Panel>
                </Tabs>
            </Container>
            <Footer />
        </Box>
    );
};

export default Achievements;