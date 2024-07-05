import { cx, React, useState, useEffect } from '@common'
import { Box, getImageUrl, Icon } from '@components'
import { useEnvironment, useIsMobileDevice, useIsTabletDevice, useApi } from '@lib'
import { getStudyDuration, getStudyPoints, isMultiSession, getStudyPi, getStudyLead, launchStudy, isStudyLaunchable } from '@models'
import { ParticipantStudy, Study } from '@api'
import styled from '@emotion/styled'
import { colors, media } from '@theme'
import { StudyDetailsPreview } from './details';
import dayjs from 'dayjs';
import { Button, Flex, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconSpec } from 'components/icon'

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
    color: 'inherit',
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
    [media.tablet]: {
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

const Researcher: React.FC<StudyCardProps> = ({ study }) => {
    const pi = study.researchers?.find(r => r.role === 'pi')
    if (!pi) return null

    return (
        <Box className='x-small' padding={{ bottom: 'small' }}>
            {pi.firstName} {pi.lastName}
        </Box>
    )
}

const CornerRibbon = styled.div({
    position: 'absolute',
    inset: '0 auto auto 0',
    background: colors.purple,
    transformOrigin: '100% 0',
    transform: 'translate(-29.3%) rotate(-45deg)',
    boxShadow: `0 0 0 999px ${colors.purple}`,
    clipPath: 'inset(0 -100%)',
    color: colors.white,
})

const NewStudyFlag: FC<{study: ParticipantStudy}> = ({ study }) => {
    if (!study.opensAt) return null
    const isNew = dayjs(study.opensAt).isAfter(dayjs().subtract(7, 'days'))
    if (!isNew) return null
    return (
        <CornerRibbon>
            <small>New Study</small>
        </CornerRibbon>
    )
}

const CompleteFlag: React.FC<StudyCardProps> = ({ study }) => {
    if (!study.completedAt) return null

    return (
        <Flex justify='center' align='center' pos='absolute' top='-.5rem' right='-.5rem' style={{ zIndex: 2 }}>
            <div style={{ width: '2rem', 
                height: '2rem', 
                backgroundColor: colors.purple, 
                borderRadius: '50%',
                boxShadow: '-2px 2px 10px rgba(0, 0, 0, 0.20)',
            }}></div>
            <Icon icon='thickCheck' color={colors.white} 
                css={{
                    position: 'absolute',
                    fontSize: '1rem',
                }}/>
        </Flex>
    )
}

const MultiSessionBar: FC<StudyCardProps> = ({ study }) => {
    if (!study.stages || study.stages.length < 2) return null
    return (
        <Flex justify='center' align='flex-start' direction='column' w='100%'>
            <StudyDetailsItem icon='cardMultiple' title='Multi-Session' desc=''/>
            <Flex justify='center' pos='relative' w="100%" direction='column' gap='xs'>
                <Flex justify='center' align='center' pos='absolute' w='100%' top='.5rem'>
                    <div css={{ width: '85%', height: '.1rem', 
                        backgroundColor: colors.gray70 }}>
                    </div>
                </Flex>
                <Flex justify='center' align='center'>
                    <Flex justify='space-between' w="90%">
                        {study.stages.map((stage, index) => {
                            return <Flex justify='center' align='center' pos='relative' key={index}>
                                <div style={{ width: '1rem', 
                                    height: '1rem', 
                                    backgroundColor: colors.white, 
                                    borderRadius: '50%',
                                    border: `2px solid ${colors.purple}`,
                                }}></div>
                                {stage.completedAt? <Icon icon="thickCheck" color={colors.purple} 
                                    css={{
                                        position: 'absolute',
                                        fontSize: '.5rem',
                                    }}/> : null}
                            </Flex>
                        })}
                    </Flex>
                </Flex>
                <Flex justify='center' align='center'>
                    <Flex justify='space-between' w="90%" c={colors.gray70}>
                        {study.stages.map((stage, index) => {
                            return <Text key={index} size='xs'>Session {index+1}/{study.stages?.length}</Text>
                        })}
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

const getTotalCompletedSessions = (study: ParticipantStudy) => {
    if (!study.stages) return 0
    return study.stages.filter(stage => stage.completedAt).length + 1
}

const PointsAndDuration: FC<StudyCardProps> = ({ study }) => {

    return (
        <Flex className={cx('mt-auto', 'pt-1')} justify='space-between' align='center' w='100%' c={colors.purple}>
            <Text size='xs'>
                <span>{getStudyDuration(study)} min | {getStudyPoints(study)} pts </span>
            </Text>
            <Text size='xs'>
                {isMultiSession(study) && <span>Session {getTotalCompletedSessions(study)}/{study.stages?.length} </span>}
            </Text>
        </Flex>
    )
}

const StudyOverlay = styled(Box) ({
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: '1', 
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: '264px',
    height: '350px',
    [media.tablet]: {
        width: '275px',
        height: '360px',
    },
    [media.mobile]: {
        width: '275px',
        height: '360px',
    }, 
})

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

const StudyDetails: React.FC<{study: ParticipantStudy, hovered: Number, index: Number, position: { top: Number, left: Number }, setHovered: Function }> = ({ study, hovered, index, position, setHovered }) => {
    
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

    return (
        <Flex pos='absolute' bg={colors.white} direction='column' align='flex-start' justify='flex-start' gap='lg'
            display={hovered == index ? 'flex' : 'none'} w='548px' top={ position.top+'px' } left={ position.left+'px' } p='1.5rem'
            style={{ zIndex: '5', boxShadow: '0px 4px 30px 0px rgba(0, 0, 0, 0.10)' }}>
            <Flex display='flex' justify='space-between' w="100%">
                <Text span fw='bolder' size='xl'>{study.titleForParticipants}</Text>
                <Icon icon='close' color={colors.gray70} onClick={() => {
                    setHovered(-1)
                }}/>
            </Flex>

            <Text size='sm' c={colors.gray70}>{study.totalDuration} mins | {study.totalPoints} pts</Text>

            <MultiSessionBar study={study} />

            <StudyDetailsItem icon='info' title='About' desc={study.longDescription} />

            <StudyDetailsItem icon='heart' title="What's in it for you?" desc={study.benefits} />

            <StudyDetailsItem icon='feedback' title='Feedback' 
                desc={`Feedback: ${study.stages?.length && study.stages[0].feedbackTypes?.reduce((acc, feedbackType, index) => {
                    if(study.stages?.length && study.stages[0].feedbackTypes?.length && index != study.stages[0].feedbackTypes?.length - 1) return acc + feedbackType + ', '
                    return acc + feedbackType + '.'
                }, '')}`} />


            <StudyDetailsItem icon='person' title='Principal Investigator' 
                desc={ pi?.firstName + ' ' + pi?.lastName + ' | Institution: ' + pi?.institution } />

            <StudyDetailsItem icon='person' title='Study Lead' 
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
            >
                {action} study
            </Button>
        </Flex>
    )
}

const StudyDetailsItem: React.FC<{icon: IconSpec, title: string, desc: string | undefined}> = ({ icon, title, desc = '' }) => {
    return (
        <Flex align='flex-start' gap='sm' direction='column'>
            <Flex align='center' gap='sm'>
                <Icon icon={icon} color={colors.purple} />
                <Text fw='bold' size='sm'>{title}</Text>
            </Flex>
            <Text size='sm'>
                {desc}
            </Text>
        </Flex>
    )
}

export const StudyCard: React.FC<{study: ParticipantStudy, index: Number, hovered: Number, setHovered: Function}> = ({ study, index, hovered, setHovered }) => {
    const nav = useNavigate()
    const api = useApi()
    const isMobile = useIsMobileDevice()
    const isTablet = useIsTabletDevice()

    const [timer, setTimer] = useState<number | null>(null)
    const [element, setElement] = useState<HTMLDivElement | null>(null)
    const [multiSessionShadow, setMultiSessionShadow] = useState<boolean>(false)
    const [position, setPosition] = useState<{top: Number, left: Number}>({ top: 0, left: 0 })

    useEffect(() => {

        const buffer = { top: isTablet? -150: -150, left0: isTablet? 255: 18, leftRest: isTablet? -560: -790 }
        if (element){
            const updatePosition = () => {
                const rect = element.getBoundingClientRect();
                index == 0 ? setPosition({ top: buffer.top, left: rect.left + buffer.left0 }) : setPosition({ top: buffer.top, left: rect.left + buffer.leftRest });
            };
            updatePosition();
            const parentWindow = element.parentElement;
            parentWindow?.addEventListener('scroll', updatePosition);
            parentWindow?.addEventListener('resize', updatePosition);
            window.addEventListener('resize', updatePosition);
            return () => {
                parentWindow?.removeEventListener('scroll', updatePosition);
                parentWindow?.removeEventListener('resize', updatePosition);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [element, index, isTablet])

    const cardMouseOver = () => {
        setMultiSessionShadow(true)
        if(study.completedAt) return
        const newTimer = setTimeout(() => {
            setHovered(index)
        }, 2000)
        setTimer(newTimer);
    }

    const cardMouseOut = () => {
        setMultiSessionShadow(false)
        setHovered(-1)
        if(timer) {
            clearTimeout(timer)
            setTimer(null)
        }
    }

    useEffect(() => {
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [timer]);

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
        <div  ref={(ele) => { setElement(ele) }} 
            onMouseOver={()=> cardMouseOver()} 
            onMouseLeave={() => cardMouseOut()}>
            
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
                {study.completedAt ? <StudyOverlay /> : null}
                {isMultiSession(study)? <MultiSessionBack createshadow={multiSessionShadow}/> : null}
                <CardContent study={study} />
            </Card>
            <StudyDetails study={study} hovered={hovered} index={index} position={position} setHovered={setHovered}/>
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
            <NewStudyFlag study={study} />
            <CompleteFlag study={study} />
            <h6 style={{ marginTop: '.5rem' }}>{study.titleForParticipants}</h6>
            <Researcher study={study} />
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
