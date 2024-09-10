import React, { useState, useEffect } from 'react';
import { Box, Text, Button, Container, Title, Tabs, RingProgress, Image, Group, Stack, Flex, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useApi } from '@lib';
import { launchStudy } from '@models';
import { TopNavBar, Footer, LoadingAnimation } from '@components';
import { colors } from '@theme';
import { useFetchLearningPaths } from './learner/studies';
import { ParticipantStudy } from '@api';
import { useCurrentUser } from '@lib';
import { notifications } from '@mantine/notifications';
import Markdown from 'react-markdown';

const AchievementsButton: FC<{isComplete: boolean, studies: ParticipantStudy[], isNew: boolean}> = ({ isComplete, studies, isNew }) => {

    const api = useApi()
    const user = useCurrentUser()

    const sendErrorNotification = () => {
        notifications.show({
            color: 'red',
            title: 'Error',
            message: 'Failed to download PDF. Please try again.',
        })
    }

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

    const handleButtonClick = async () => {
        if(!isComplete){
            const incompleteStudy = studies.find((study) => !study.completedAt)
            if(incompleteStudy){
                launchStudy(api, incompleteStudy.id)
            }
        }else{
            try{
                const email = user.contactInfos?.find(e => e.type == 'EmailAddress')?.value
                if(!email){
                    sendErrorNotification()
                    return
                }

                const response = await api.getBadgeCertificate({
                    badgeId: studies[0].learningPath?.badgeId || '',
                    email: email,
                });
                const pdfUrl = convertBase64ToPdf(response.pdf || '');
                window.open(pdfUrl, '_blank');
            }catch(error){
                sendErrorNotification()
            }
        }       
    }

    return (
        <Button onClick={() => handleButtonClick()} variant='outline' c={colors.btnPurple} pl={35} pr={35} style={{ border: `1px solid ${colors.purple}` }}>
            {isComplete? 'Download Certificate' : isNew? 'Start' : 'Continue'}
        </Button>
    )
}

const BadgeTags:FC<{tags: string[]}> = ({ tags }) => {
    return (
        <Group gap={5}>{tags?.map((tag) => {
            return <Text key={tag} p={0} size='sm'>#{tag}</Text>
        })}</Group>
    )
}

const BadgeDetails:FC<{
    studies: ParticipantStudy[], 
    opened: boolean, 
    isComplete: boolean, 
    isNew: boolean, 
    close: () => void }> 
    = ({ studies, opened, isComplete, isNew, close }) => {

        return (
            <Modal c={colors.text} opened={opened} onClose={close} title={<Text size="lg" pl={20} pt={10} fw={700}>{studies[0].learningPath?.label + ''}</Text>} centered>
                <Stack pl={20} pr={20} pb={20}>
                    <Stack gap='xs'>
                        <Text size="sm">
                            {studies[0].learningPath?.badge?.description}
                        </Text>
                        <BadgeTags tags={studies[0].learningPath?.badge?.tags || []} />
                    </Stack>
                    <Stack style={{ fontSize: '.875rem' }}>
                        <Markdown>{studies[0].learningPath?.badge?.criteriaHtml}</Markdown>
                    </Stack>
                    <Group>
                        <AchievementsButton isComplete={isComplete} isNew={isNew} studies={studies}/>
                    </Group>
                </Stack>
            </Modal>
        )
    }

const SecondaryBadgeTag:FC<{learningPath: string}> = ({ learningPath }) => {

    const categories: Record<string, string> = {
        'Personal Finance': 'Understanding',
        'Growth & Resilience': 'Understanding',
        'Mental Agility': 'Exploring',
        'Learning Persistence': 'Understanding',
        'Productivity': 'Understanding',
        'Interpersonal Skills': 'Exploring',
        'Study Strategies': 'Exploring',
        'STEM Careers': 'Exploring',
        'Biology Learning': 'Study Strategies',
        'Future Careers': 'Exploring',
    }

    return(
        <Text size='md'>{categories[learningPath] || 'Other'}</Text>
    )
}
const AchievementBadge:FC<{learningPath: string; studies: ParticipantStudy[]}> = ({ learningPath, studies }) => {

    const [progress, setProgress] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    
    const [completedStudies, setCompletedStudies] = useState<ParticipantStudy[]>([])
    const [opened, { open, close }] = useDisclosure(false)

    useEffect(() => {
        setCompletedStudies(studies.filter((study: ParticipantStudy) => study.completedAt))
    }, [studies])

    useEffect(() => {
        setProgress((completedStudies.length / studies.length) * 100)
        setIsComplete(completedStudies.length == studies.length)
    }, [completedStudies, isComplete])

    return(
        <Stack>
            <BadgeDetails studies={studies} opened={opened} close={close} isComplete={isComplete} isNew={completedStudies.length == 0}/>
            <Group>
                <RingProgress
                    size={350}
                    thickness={15}
                    sections={[{ value: progress, color: completedStudies.length == 0? colors.grayDisabled : isComplete ? colors.purple : colors.green }]}
                    label={
                        <Group justify='center' align='center'>
                            <Group pos='relative' justify='center' align='center' w={230} h={230} style={{ overflow: 'hidden', borderRadius: '100%' }}>
                                <Image src={ studies[0].learningPath?.badge?.image } w={230} h="auto"/>
                            </Group>
                        </Group>
                    }
                    onClick={open}
                    style={{ cursor: 'pointer' }}
                />   
            </Group>
            <Stack justify='center' align='center' mt={-30} pb={40}>
                <Flex justify='center' align='center' gap="0" direction='column'>
                    <SecondaryBadgeTag learningPath={learningPath}/>
                    <Text size='lg' fw={700}>{learningPath}</Text>
                    <Text size='xs' c={colors.gray70}>{completedStudies.length} of {studies.length}</Text>
                </Flex>
                <AchievementsButton isComplete={isComplete} studies={studies} isNew={completedStudies.length == 0}/>
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
            { Object.keys(learningPaths).length > 0 ? <><Container size="lg" my="xl">
                <Title mb="lg" mt="lg" order={2}>
                    Achievements
                </Title>
                <Tabs
                    value={selectedTab}
                    onChange={(value) => setSelectedTab(value as 'Badges')}
                    variant="unstyled"
                >
                    <Tabs.List c={ colors.blue }>
                        <Tabs.Tab value="Badges" pl={0}>
                            <Text size='xl'>BADGES</Text>
                        </Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="Badges">
                        <Stack c={colors.text} >
                            <Text>Explore the study paths, track your progress, and access your digital badges.</Text>
                            <Group gap="md" justify='center' align='center'>
                                {Object.entries(learningPaths).map(([learningPath, studies]) => {
                                    return <AchievementBadge key={learningPath} learningPath={learningPath} studies={studies}/>
                                })}
                            </Group>
                        </Stack>
                    </Tabs.Panel>
                </Tabs>
            </Container>
            <Footer /> </> : <LoadingAnimation />}
        </Box>
    );
};

export default Achievements;