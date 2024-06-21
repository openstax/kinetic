import { cx, React, useState } from '@common'
import { Box, getImageUrl, Icon, MultiSessionBar } from '@components'
import { useEnvironment, useIsMobileDevice } from '@lib'
import { getStudyDuration, getStudyPoints, isMultiSession } from '@models'
import { ParticipantStudy, Study } from '@api'
import styled from '@emotion/styled'
import { colors, media } from '@theme'
import { StudyDetailsPreview } from './details';
import dayjs from 'dayjs';
import { Button, Space, Flex } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

interface StudyCardProps {
    study: ParticipantStudy
}

const Card = styled(Box)(({ studyCompleted, }) => ({
    minWidth: 264,
    maxWidth: 264,
    backgroundColor: studyCompleted ? colors.gray50 : colors.white,
    padding: '1rem',
    position: 'relative',
    color: 'inherit',
    textDecoration: 'none',
    cursor: studyCompleted ? 'not-allowed' : 'pointer',
    minHeight: 350,
    maxHeight: 350,
    '&:hover': {
        boxShadow: '0px 4px 30px 0px rgba(0, 0, 0, 0.10)',
    },
    '.study-card-image': {
        height: 152,
        minHeight: 152,
        maxHeight: 152,
    },
    [media.tablet]: {
        minWidth: 275,
        maxWidth: 275,
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

const MultiSession: React.FC<StudyCardProps> = ({ study }) => {
    if (!isMultiSession(study)) return <span />

    return (
        <Box align='center' gap>
            <Icon
                height={15}
                icon="cardMultiple"
                color={colors.purple}
                tooltip="This study has multiple sessions. The other sessions will be released once available."
            />
            <span>Multi-Session</span>
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
        <Flex justify='center' align='center' pos='absolute' top='-.5rem' right='-.5rem'
        style={{}}>
            <div style={{ width: '2rem', 
                height: '2rem', 
                backgroundColor: colors.pine, 
                borderRadius: '50%',
                boxShadow: '-2px 2px 10px rgba(0, 0, 0, 0.20)'
                }}></div>
            <Icon icon="thickCheck" color={colors.white} 
                css={{
                    position: 'absolute',
                    fontSize: '1rem',
                }}/>
        </Flex>
    )
}

const MultiSessionFlag: FC<StudyCardProps> = ({ study }) => {
    if (!isMultiSession(study) || !study.stages?.[0].completedAt || !!study.stages?.[1].completedAt) return null

    return (
        <div
            css={{
                position: 'absolute',
                borderBottomLeftRadius: 20,
                borderTopLeftRadius: 20,
                right: 0,
                top: 16,
                width: 250,
                backgroundColor: 'white',
                zIndex: 3,
                height: 80,
                padding: 20,
                display: 'flex',
                flex: 1,
                overflow: 'hidden',
                boxShadow: '0px 4px 8px rgb(0 0 0 / 18%)',
            }}
        >
            <MultiSessionBar study={study} />
        </div>
    )
}

const FeedbackMultiSessionContainer: FC<StudyCardProps> = ({ study }) => {
    const isMobile = useIsMobileDevice();

    if (!isMultiSession(study)) {
        return <Space h='md' />
    }

    return (
        <Box
            className={cx({ 'xx-small': isMobile })}
            justify='between'
            wrap
            margin={{ top: 'default' }}
            css={{ minHeight: 35 }}
        >
            <MultiSession study={study} />
        </Box>
    )
}

const PointsAndDuration: FC<StudyCardProps> = ({ study }) => {
    const isMobile = useIsMobileDevice();

    return (
        <Box className={cx({ 'small': !isMobile, 'xx-small': isMobile }, 'mt-auto', 'pt-1')} justify='between' align='center' wrap css={{color:colors.purple}}>
            <Box gap='small'>
                <span>{getStudyDuration(study)} min </span>
                |
                <span>{getStudyPoints(study)} pts </span>
            </Box>
            <Box>
                {isMultiSession(study) && <span>*Total</span>}
            </Box>
        </Box>
    )
}

export const StudyCard: React.FC<StudyCardProps> = ({ study }) => {
    const nav = useNavigate()
    const onClick = () => {
        if(study.completedAt) return
        nav(`/studies/details/${study.id}`)
    }
    const env = useEnvironment()

    return (
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
            studyCompleted={!!study.completedAt}
        >
            <CardContent study={study} />
        </Card>
    )
}

const CardContent: FC<{study: ParticipantStudy}> = ({ study }) => {
    const isMobile = useIsMobileDevice();

    return (
        <>
            <img src={getImageUrl(study.imageId)}
                alt={study.imageId}
                className='study-card-image'
            />
            <NewStudyFlag study={study} />
            <CompleteFlag study={study} />
            <MultiSessionFlag study={study} />
            <FeedbackMultiSessionContainer study={study} />
            <h6>{study.titleForParticipants}</h6>
            <Researcher study={study} />
            <small
                className={cx({ 'x-small': isMobile })}
                css={{ color: colors.gray70, overflowWrap: 'anywhere' }}
            >
                {study.shortDescription}
            </small>
            <PointsAndDuration study={study} />
        </>
    )
}

export const StudyCardPreview: FC<{study: Study}> = ({ study }) => {
    const [showDetails, setShowDetails] = useState<boolean>(false)
    return (
        <Card className="col study" direction='column'>
            <CardContent study={study as ParticipantStudy} />
            <Button
                variant='outline'
                mt='auto'
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
