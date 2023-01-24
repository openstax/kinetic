import { React, useCallback } from '@common'
import { Box, Icon, MultiSessionBar } from '@components'
import { get } from 'lodash'
import { toSentence } from '@lib'
import { studyIsMultipart, TagLabels, tagOfType, tagsOfType } from '@models'
import { ParticipantStudy } from '@api'
import styled from '@emotion/styled'
import { CardImages } from '../../components/study-card-images/images'

import { colors, media } from '../../theme'

interface StudyCardProps {
    study: ParticipantStudy
    className?: string
}

const Card = styled(Box)({
    minWidth: 300,
    maxWidth: 450,
    backgroundColor: 'white',
    padding: '1rem',
    boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    color: 'inherit',
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': {
        boxShadow: '0px 8px 10px rgba(0, 0, 0, 0.4)',
    },
    '.study-card-image': {
        height: 200,
    },
    [media.mobile]: {
        minWidth: 275,
        maxWidth: 275,
        margin: '0 auto',
        padding: '1rem',
        height: '500px',
        '.study-card-image': {
            minHeight: '35%',
            maxHeight: '35%',
        },
    },
})


const Tag: React.FC<{ tag?: string }> = ({ tag }) => (
    tag ? <span className="badge text-dark" css={{ borderRadius: 8, background: colors.gray }}>{get(TagLabels, tag, tag)}</span> : null
)

const Researchers: React.FC<StudyCardProps> = ({ study }) => {
    const names: string[] = (study.researchers?.map(r => r.name || '') || []).filter(Boolean)
    if (!names.length) return null

    return (
        <span>{toSentence(names)}</span>
    )
}

const Feedback: React.FC<StudyCardProps> = ({ study }) => {
    if (!study.feedbackDescription) return <span />

    return (
        <Box align='center' gap>
            <Icon height={15} icon="feedback" color={colors.purple} />
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
                icon="multiStage"
                color={colors.purple}
                tooltip="This study has multiple sessions. The other sessions will be released once available."
            />
            <span>Multi-Session</span>
        </Box>
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

export const StudyCard: React.FC<StudyCardProps & { onSelect(study: ParticipantStudy): void }> = ({
    onSelect,
    study,
}) => {
    const Image = CardImages[study.imageId || 'StemInterest'] || CardImages.StemInterest

    const onClick = useCallback(() => onSelect(study), [onSelect])
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
            <Image.image
                name={Image.title}
                className='study-card-image'
                css={{
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: 8,
                }}
            />
            <CompleteFlag study={study} />
            <MultiSessionFlag study={study} />
            <Box className="small" justify='between' wrap margin={{ bottom: 'default', top: 'default' }} css={{ minHeight: 40 }}>
                <Feedback study={study} />
                <MultiSession study={study} />
            </Box>
            <h6>
                {study.title}
            </h6>
            <Researchers className="xx-small" study={study} />
            <p className="x-small" css={{ color: colors.grayText }}>
                {study.shortDescription}
            </p>
            <Box flex />
            <Box direction={{ mobile: 'column' }} justify='between' align={{ desktop: 'center' }}>
                <Box gap>
                    <Tag tag={tagOfType(study, 'topic')} />
                    {tagsOfType(study, 'subject').map(tag => <Tag key={tag} tag={tag} />)}
                </Box>
                <Box className='small my-1' >
                    {!!study.totalDuration && <div>
                        {studyIsMultipart(study) && <span>*Total: </span>}
                        {study.totalDuration}min
                    </div>}

                    {!!study.totalPoints && <span>&nbsp;&middot; {study.totalPoints}pts</span>}
                </Box>
            </Box>
        </Card>
    )

}
