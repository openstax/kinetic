import { cx, React, useCallback, useState } from '@common'
import { Box, getImageUrl, Icon, MultiSessionBar, ResearcherButton } from '@components'
import { useIsMobileDevice } from '@lib'
import { getStudyDuration, getStudyPoints, studyHasFeedback, studyIsMultipart } from '@models'
import { ParticipantStudy, Study } from '@api'
import styled from '@emotion/styled'
import { colors, media } from '@theme'
import { StudyDetailsPreview } from './details';
import dayjs from 'dayjs';

interface StudyCardProps {
    study: ParticipantStudy
    className?: string
}

const Card = styled(Box)({
    minWidth: 400,
    maxWidth: 400,
    backgroundColor: 'white',
    padding: '1rem',
    boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    color: 'inherit',
    textDecoration: 'none',
    cursor: 'pointer',
    minHeight: 475,
    maxHeight: 475,
    borderRadius: 8,
    overflow: 'hidden',
    '&:hover': {
        boxShadow: '0px 8px 10px rgba(0, 0, 0, 0.4)',
    },
    '.study-card-image': {
        height: 200,
        minHeight: 200,
        maxHeight: 200,
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
})

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

const Feedback: React.FC<StudyCardProps> = ({ study }) => {
    if (!studyHasFeedback(study)) return <span />

    return (
        <Box align='center' gap>
            <Icon height={18} icon="feedback" color={colors.purple} />
            <span>Feedback Available</span>
        </Box>
    )
}

const MultiSession: React.FC<StudyCardProps> = ({ study }) => {
    if (!studyIsMultipart(study)) return <span />

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

const NewStudyFlag: FC<{study: Study}> = ({ study }) => {
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
        <Box gap
            align="center"
            padding="default"
            css={{
                backgroundColor: colors.green,
                position: 'absolute',
                borderBottomLeftRadius: 20,
                borderTopLeftRadius: 20,
                right: 0,
                top: 16,
            }}
        >
            <Icon icon="checkCircle" color='white' />
            <span>Complete</span>
        </Box>
    )
}

const MultiSessionFlag: FC<StudyCardProps> = ({ study }) => {
    if (!studyIsMultipart(study) || !study.stages?.[0].isCompleted || study.stages?.[1].isCompleted) return null

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

    if (!studyHasFeedback(study) && !studyIsMultipart(study)) {
        return (
            <Box margin={{ top: 'default', bottom: 'default' }}></Box>
        )
    }

    return (
        <Box
            className={cx({ 'xx-small': isMobile })}
            justify='between'
            wrap
            margin={{ top: 'default' }}
            css={{ minHeight: 35 }}
        >
            <Feedback study={study} />
            <MultiSession study={study} />
        </Box>
    )
}

const PointsAndDuration: FC<StudyCardProps> = ({ study }) => {
    const isMobile = useIsMobileDevice();

    return (
        <Box className={cx({ 'small': !isMobile, 'xx-small': isMobile }, 'mt-auto', 'pt-1')} justify='between' align='center' wrap>
            <Box gap='small'>
                <Tag tag={study.topic} />
                <Tag tag={study.subject} />
            </Box>
            <Box gap='small'>
                {studyIsMultipart(study) && <span>*Total</span>}
                <span>{getStudyDuration(study)} min</span>
                &middot;
                <span>{getStudyPoints(study)} pts</span>
            </Box>
        </Box>
    )
}

export const StudyCard: React.FC<StudyCardProps & { onSelect(study: ParticipantStudy): void }> = ({
    onSelect,
    study,
}) => {
    const onClick = useCallback(() => onSelect(study), [onSelect]);

    return (
        <Card
            as="a"
            role={'link'}
            className="col study"
            direction='column'
            data-study-id={study.id}
            data-is-completed={!!study.completedAt}
            onClick={onClick}
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
                css={{
                    border: `1px solid ${colors.gray50}`,
                    borderRadius: 8,
                }}
            />
            <NewStudyFlag study={study} />
            <CompleteFlag study={study} />
            <MultiSessionFlag study={study} />
            <FeedbackMultiSessionContainer study={study} />
            <h6>{study.titleForParticipants}</h6>
            <Researcher className="xx-small" study={study} />
            <small
                className={cx({ 'x-small': isMobile })}
                css={{ color: colors.text, overflowWrap: 'anywhere' }}
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
            <ResearcherButton
                buttonType='secondary'
                className='justify-content-center mt-3'
                onClick={() => {setShowDetails(true)}}
            >
                Preview Study Details
            </ResearcherButton>
            <StudyDetailsPreview
                study={study as ParticipantStudy}
                show={showDetails}
                onHide={() => setShowDetails(false)}
                preview={true}
            />
        </Card>
    )
}
