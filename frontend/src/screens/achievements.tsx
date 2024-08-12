import React, { useState, useEffect } from 'react';
import { Box, Text, Button, Container, Title, Tabs, RingProgress, Image, Group, Stack, Flex, Modal, Overlay, Alert } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useApi } from '@lib';
import { launchStudy } from '@models';
import { TopNavBar, Footer } from '@components';
import { colors } from '@theme';
import { useFetchLearningPaths } from './learner/studies';
import { ParticipantStudy } from '@api';
import { useCurrentUser } from '@lib';

const AchievementBadge:FC<{learningPath: string; studies: ParticipantStudy[]}> = ({ learningPath, studies }) => {

    interface Criteria{
        title: string,
        text: string
    }

    const api = useApi()
    const user = useCurrentUser()
    const [progress, setProgress] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [criteria, setCriteria] = useState<Criteria[]>([] || undefined)
    const [completedStudies, setCompletedStudies] = useState<ParticipantStudy[]>([])
    const [btnText, setBtnText] = useState('Start')
    const [error, setError] = useState(false)
    const [opened, { open, close }] = useDisclosure(false)

    useEffect(() => {
        setCompletedStudies(studies.filter((study: ParticipantStudy) => study.completedAt))
        setCriteria(() => {
            return studies[0].learningPath?.badge?.criteriaHtml?.split('**')
                .slice(1)
                .reduce<Criteria[]>((acc: Criteria[], item, index, array) => {
                if (index % 2 === 0) {
                    acc.push({ title: item.trim(), text: array[index + 1].trim() });
                }
                return acc;
            }, []) || []; 
        })
        
    }, [studies])

    useEffect(() => {
        setProgress((completedStudies.length / studies.length) * 100)
        setIsComplete(completedStudies.length == studies.length)
    }, [completedStudies, isComplete])

    useEffect(() => {
        setBtnText(() => {
            if(isComplete){
                return 'Download Certificate'
            }

            if(completedStudies.length > 0){
                return 'Continue'
            }

            return 'Start'
        })
    }, [completedStudies, isComplete])

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
                    setError(true)
                    return
                }

                const response = await api.getBadgeCertificate({
                    badgeId: studies[0].learningPath?.badgeId || '',
                    email: email,
                });
                const pdfUrl = convertBase64ToPdf(response.pdf || '');
                window.open(pdfUrl, '_blank');
            }catch(error){
                setError(true)
            }
        }       
    }

    return(
        <Stack>
            {error? <Alert title="Error" color="red" withCloseButton onClose={() => setError(false)}>Fail to download the PDF. Please try again later.</Alert> : ''}
            <Modal c={colors.text} opened={opened} onClose={close} title={<Text size="lg" pl={20} pt={10} fw={700}>{learningPath}</Text>} centered>
                <Stack pl={20} pr={20} pb={20}>
                    <Stack>
                        <Text size="sm">
                            <span>{studies[0].learningPath?.badge?.description}</span><br/>
                            <div style={{ marginTop: '.5rem' }}>{studies[0].learningPath?.badge?.tags?.map((tag) => {
                                return '#'+tag+' ' 
                            })}</div>
                        </Text>
                    </Stack>
                    <Stack>
                        {criteria.map((cr) => {
                            return (
                                <Group key={cr.title}>
                                    <Text size="sm"><span style={{ fontWeight: '700' }}>{cr.title}</span>{cr.text}</Text>
                                </Group>
                            )
                        })}
                    </Stack>
                    <Group>
                        <Button onClick={() => handleButtonClick()} variant='filled' color={colors.purple}>{btnText}</Button>
                    </Group>
                </Stack>
            </Modal>
            <Group>
                <RingProgress
                    size={350}
                    thickness={15}
                    sections={[{ value: progress, color: completedStudies.length == 0? colors.grayDisabled : isComplete ? colors.purple : colors.green }]}
                    label={
                        <Group justify='center' align='center'>
                            <Group pos='relative' justify='center' align='center' w={230} h={230} style={{ overflow: 'hidden', borderRadius: '100%' }}>
                                <Image src={ studies[0].learningPath?.badge?.image } w={230} h="auto"/>
                                {completedStudies.length == 0? <Overlay color="#000" backgroundOpacity={0.25} /> : ''}
                            </Group>
                        </Group>
                    }
                    onClick={open}
                    style={{ cursor: 'pointer' }}
                />
                 
            </Group>
            <Stack justify='center' align='center' mt={-30} pb={40}>
                <Flex justify='center' align='center' gap="0" direction='column'>
                    <Text size='md'>Learning</Text>
                    <Text size='lg' fw={700}>{learningPath}</Text>
                    <Text size='xs' c={colors.gray70}>{completedStudies.length} of {studies.length}</Text>
                </Flex>
                
                <Button onClick={() => handleButtonClick()} variant='outline' c={colors.btnPurple} pl={35} pr={35} style={{ border: `1px solid ${colors.purple}` }}>{btnText}</Button>
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
                    <Tabs.List c={ colors.blue }>
                        <Tabs.Tab value="Badges" pl={0}>
                            <Text size='xl'>BADGES</Text>
                        </Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="Badges">
                        <Stack c={colors.text} >
                            <Text>Explore the study paths, track your progress, and access your digital badges.</Text>
                            <Group gap="xs" justify='flex-start' align='center'>
                                {Object.entries(learningPaths).map(([learningPath, studies]) => {
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