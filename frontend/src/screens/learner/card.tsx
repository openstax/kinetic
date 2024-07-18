import { cx, React, useState } from '@common'
import { Box, getImageUrl } from '@components'
import { useEnvironment, useIsMobileDevice, useApi } from '@lib'
import { isMultiSession, getStudyPi, getStudyLead, launchStudy, isStudyLaunchable, getPointsForCurrentStage, getCurrentStudyDuration } from '@models'
import { ParticipantStudy, Study } from '@api'
import styled from '@emotion/styled'
import { colors, media } from '@theme'
import { StudyDetailsPreview } from './details';
import { Button, Flex, Text, HoverCard, Title, Group, Stack, Overlay } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconBoxMultiple, IconCheck, IconHeartFilled, IconInfoCircleFilled, IconBaselineDensityMedium, IconUserFilled } from '@tabler/icons-react'

interface StudyCardProps {
    study: ParticipantStudy
}

const Card = styled(Box)<{ studycompleted: boolean, multisession: boolean }>(({ studycompleted, multisession }) => ({
    minWidth: 264,
    maxWidth: 264,
    backgroundColor: colors.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1.3,
    padding: '1rem',
    position: 'relative',
    color: colors.text,
    textDecoration: 'none',
    transformStyle: 'preserve-3d',
    border: multisession? `1px solid ${colors.lightGreen}` : 'none',
    cursor: studycompleted ? 'not-allowed' : 'pointer',
    height: 350,
    maxHeight: 400,
    boxShadow: multisession? '0px 4px 10px 0px rgba(0, 0, 0, 0.25)' : 'none',
    '&:hover': {
        boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.25)',
    },
    '.study-card-image': {
        width: 232,
        height: 152,
        minHeight: 152,
        maxHeight: 152,
    },
    [media.mobile]: {
        minWidth: 275,
        maxWidth: 275,
        lineHeight: 1.2,
        margin: '0 auto',
        padding: '1rem',
        minHeight: 360,
        maxHeight: 360,
        '.study-card-image': {
            minHeight: '35%',
            maxHeight: '35%',
            height: '35%',
        },
    },
}))

export const Tag: React.FC<{ tag?: string }> = ({ tag }) => {
    if (!tag) return null
    return (
        <span className="badge text-dark" css={{ borderRadius: 8, background: colors.gray30 }}>
            {tag}
        </span>
    )
}

const CompleteFlag: React.FC<StudyCardProps> = ({ study }) => {
    if (!study.completedAt) return null

    return (
        <Group justify='center' align='center' pos='absolute' top='-.5rem' right='-.5rem' style={{ zIndex: 300 }}>
            <div style={{ width: '2rem', 
                height: '2rem', 
                backgroundColor: colors.purple, 
                borderRadius: '50%',
                boxShadow: '-2px 2px 10px rgba(0, 0, 0, 0.20)',
            }}></div>
            <IconCheck size='1rem' color={ colors.white } stroke={5} style={{ position: 'absolute' }}/>
        </Group>
    )
}

const MultiSessionBar: FC<StudyCardProps> = ({ study }) => {
    if (!study.stages || study.stages.length < 2) return null
    return (
        <Stack justify='center' align='flex-start' gap='xs' w='100%'>
            <StudyDetailsItem Icon={IconBoxMultiple} title='Multi-Session' desc=''/>
            <Stack justify='center' pos='relative' w="100%" gap='xs'>
                <Group justify='center' align='center' pos='absolute' w='100%' top='.5rem'>
                    <div css={{ width: '85%', height: '.1rem', 
                        backgroundColor: colors.gray70 }}>
                    </div>
                </Group>
                <Group justify='center' align='center'>
                    <Group justify='space-between' w="90%">
                        {study.stages.map((stage, index) => {
                            return <Group justify='center' align='center' pos='relative' key={index}>
                                <div style={{ width: '1rem', 
                                    height: '1rem', 
                                    backgroundColor: colors.white, 
                                    borderRadius: '50%',
                                    border: `2px solid ${colors.purple}`,
                                }}></div>
                                {stage.completedAt? <IconCheck color={colors.purple} stroke={5} size="0.5rem"
                                    style={{
                                        position: 'absolute',
                                    }}/> : null}
                            </Group>
                        })}
                    </Group>
                </Group>
                <Group justify='center' align='center'>
                    <Group justify='space-between' w="90%" c={colors.gray70}>
                        {study.stages.map((stage, index) => {
                            return <Text key={index} size='xs'>Session {index+1}/{study.stages?.length}</Text>
                        })}
                    </Group>
                </Group>
            </Stack>
        </Stack>
    )
}

const getTotalCompletedSessions = (study: ParticipantStudy) => {
    if (!study.stages) return 0
    return study.stages.filter(stage => stage.completedAt).length + 1
}

const PointsAndDuration: FC<StudyCardProps> = ({ study }) => {

    return (
        <Group mt='auto' justify='space-between' align='center' w='100%' c={colors.purple}>
            <Text size='xs'>
                <span>{getCurrentStudyDuration(study)} min | {getPointsForCurrentStage(study)} pts </span>
            </Text>
            <Text size='xs'>
                {isMultiSession(study) && <span>Session {getTotalCompletedSessions(study)}/{study.stages?.length} </span>}
            </Text>
        </Group>
    )
}

const MultiSessionBack = styled(Box)<{ createshadow: boolean }> (({ createshadow }) => ({
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: '1',
    backgroundColor: colors.white,
    width: '264px',
    height: '350px',
    [media.tablet]: {
        width: '275px',
        height: '360px',
    },[media.mobile]: {
        width: '275px',
        height: '360px',
    },
    transform: 'translateZ(-8px)',
    border: `1px solid ${colors.lightGreen}`,
    boxShadow: createshadow? '0px 4px 10px 0px rgba(0, 0, 0, 0.25)' : 'none',
}))

const StudyDetails: React.FC<{ study: ParticipantStudy }> = ({ study }) => {
    
    const api = useApi()
    const env = useEnvironment()
    const pi = getStudyPi(study)
    const lead = getStudyLead(study)
    const [isBusy, setIsBusy] = useState<boolean>(false)
    const action = (study.stages?.length && !study.stages[0].completedAt) ? 'Start' : 'Continue'

    const onLaunch = async () => {
        setIsBusy(true)
        await launchStudy(api, study.id)
    }

    const getFeedbackDescription = () => {
        if(study.stages?.length && study.stages[0].feedbackTypes?.length) {
            return study.stages[0].feedbackTypes?.reduce((acc, feedbackType, index) => {
                if(study.stages?.length && study.stages[0].feedbackTypes?.length && index != study.stages[0].feedbackTypes?.length - 1) return acc + feedbackType + ', '
                return acc + feedbackType
            }, '')
        }
        return ''
    }

    return (
        <Stack align='flex-start' justify='flex-start' gap='lg' p='1rem' pos='relative' c={colors.text}>

            <Stack gap='0.25rem'>
                <Title order={4}>{study.titleForParticipants}</Title>
                <Text size='sm' c={colors.gray70}>{study.totalDuration} mins | {study.totalPoints} pts</Text>
            </Stack>

            <MultiSessionBar study={study} />

            <StudyDetailsItem Icon={IconInfoCircleFilled} title='About' desc={study.longDescription} />

            <StudyDetailsItem Icon={IconHeartFilled} title="What's in it for you?" desc={study.benefits} />

            <StudyDetailsItem Icon={IconBaselineDensityMedium} title='Feedback' 
                desc={`Feedback: ${getFeedbackDescription()}`} />

            <StudyDetailsItem Icon={IconUserFilled} title='Principal Investigator' 
                desc={ pi?.firstName + ' ' + pi?.lastName + ' | Institution: ' + pi?.institution } />

            <StudyDetailsItem Icon={IconUserFilled} title='Study Lead' 
                desc={lead?.firstName + ' ' + lead?.lastName + ' | Institution: ' + lead?.institution } />

            <Button
                color='purple'
                loading={isBusy}
                data-analytics-select-content
                data-content-type='study-launch'
                data-content-tags={`,learning-path=${study.learningPath?.label},is-new-user=${env.isNewUser},`}
                disabled={!isStudyLaunchable(study)}
                data-testid='launch-study'
                onClick={onLaunch}
                style={{ marginLeft: '1.5rem' }}
            >
                {action} study
            </Button>
        </Stack>
    )
}

const StudyDetailsItem: React.FC<{Icon: React.ElementType, title: string, desc: string | undefined}> = ({ Icon, title, desc = '' }) => {
    return (
        <Flex align='flex-start' justify='center' gap='0.5rem'>
            <Flex align='flex-start' justify='flex-start'>
                <Icon style={{ color: colors.purple }} size='1rem' />
            </Flex>
            <Stack gap='0.25rem'>
                <Text fw='bold' lh='.9rem' size='sm'>{title}</Text>
                <Text size='sm'>
                    {desc}
                </Text>
            </Stack>
        </Flex>
    )
}

export const StudyCard: React.FC<{study: ParticipantStudy }> = ({ study }) => {
    const nav = useNavigate()
    const api = useApi()
    const isMobile = useIsMobileDevice()
    const [multiSessionShadow, setMultiSessionShadow] = useState<boolean>(false)

    const cardMouseOver = () => {
        setMultiSessionShadow(true)
    }

    const cardMouseOut = () => {
        setMultiSessionShadow(false)
    }

    const onClick = () => {
        if(study.completedAt) return
        if (isMobile) {
            nav(`/studies/details/${study.id}`)
            return
        }
        
        launchStudy(api, study.id)
    }
    const env = useEnvironment()

    return (
        <div
            onMouseOver={()=> cardMouseOver()} 
            onMouseLeave={() => cardMouseOut()}>
            <HoverCard shadow="md" width={548} withArrow openDelay={2000} closeDelay={200} position='right' 
                disabled={isMobile || !!study.completedAt}>
                <HoverCard.Target>
                    <Card
                        as="a"
                        role={'link'}
                        className="col study"
                        direction='column'
                        onClick={onClick}
                        data-study-id={study.id}
                        data-is-completed={!!study.completedAt}
                        data-analytics-select-content
                        data-content-type="study-details"
                        data-content-tags={`,learning-path=${study.learningPath?.label},is-new-user=${env.isNewUser},`}
                        studycompleted={!!study.completedAt}
                        multisession={isMultiSession(study)}
                    >
                        {study.completedAt ? <Overlay color="#000" backgroundOpacity={0.2} /> : null}
                        {isMultiSession(study)? 
                            <MultiSessionBack createshadow={multiSessionShadow}>
                                {study.completedAt ? <Overlay color="#000" backgroundOpacity={0.2} /> : null}
                            </ MultiSessionBack>: null}
                        <CardContent study={study} />
                    </Card>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <StudyDetails study={study}/>
                </HoverCard.Dropdown>
            </HoverCard>
        </div>
    )
}

const CardContent: FC<{study: ParticipantStudy}> = ({ study }) => {
    const isMobile = useIsMobileDevice();

    return (
        <Flex justify='center' align='flex-start' direction='column' h="100%">
            <img src={getImageUrl(study.imageId)}
                alt={study.imageId}
                className='study-card-image'
            />
            <CompleteFlag study={study} />
            <Title order={6} >{study.titleForParticipants}</Title>
            <small
                className={cx({ 'x-small': isMobile })}
                css={{ color: colors.gray70, overflowWrap: 'anywhere' }}
            >
                {study.shortDescription}
            </small>
            <PointsAndDuration study={study} />
        </Flex>
    )
}

export const StudyCardPreview: FC<{study: Study}> = ({ study }) => {
    const [showDetails, setShowDetails] = useState<boolean>(false)
    return (
        <Card className="col study" direction='column' studycompleted={false} multisession={isMultiSession(study)}>
            <CardContent study={study as ParticipantStudy} />
            <Button
                variant='outline'
                mt='.5rem'
                onClick={() => {setShowDetails(true)}}
            >
                Preview Study Details
            </Button>
            <StudyDetailsPreview
                study={study as ParticipantStudy}
                show={showDetails}
                onHide={() => setShowDetails(false)}
                preview={true}
            />
        </Card>
    )
}
