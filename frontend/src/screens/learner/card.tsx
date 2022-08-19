import { React, useCallback } from '@common'
import { Box, Icon } from '@components'
import { get } from 'lodash'
import { toSentence } from '@lib'
import { tagOfType, tagsOfType, TagLabels } from '@models'
import { ParticipantStudy } from '@api'
import styled from '@emotion/styled'
import { CardImages } from '../../components/study-card-images/images'
import multiStageIcon from '@iconify-icons/bi/stack'
import { colors } from '../../theme'

interface StudyCardProps {
    study: ParticipantStudy
}

const Card = styled(Box)({
    minWidth: 300,
    maxWidth: 450,
    backgroundColor: 'white',
    padding: '2rem',
    boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.1)',
})

const Tag: React.FC<{ tag?: string }> = ({ tag }) => (
    tag ? <span className="badge text-dark" css={{ borderRadius: 8, background: colors.gray }}>{get(TagLabels, tag, tag)}</span> : null
)

const Researchers: React.FC<StudyCardProps> = ({ study }) => {
    const names: string[] = (study.researchers?.map(r => r.name || '') || []).filter(Boolean)
    if (!names.length) return null

    return (
        <p css={{ fontSize: 14, color: colors.blackText }}>{toSentence(names)}</p>
    )
}

const Feedback: React.FC<StudyCardProps> = ({ study }) => {
    if (!study.feedbackDescription) return null

    return (
        <Box align='center' gap margin="default">
            <Icon icon="feedback" color={colors.purple} />
            <span css={{ color: colors.darkText }}>Feedback Available</span>
        </Box>
    )
}

const MultiSession: React.FC<StudyCardProps> = ({ study }) => {
    if ((study.stages || []).length < 2) return null

    return (
        <Box align='center' gap margin="default">
            <Icon
                icon={multiStageIcon}
                color={colors.purple}
                tooltipProps={{ displayType: 'tooltip' }}
                tooltip="This study has multiple sessions. The other sessions will be released once available."
            />
            <span css={{ color: colors.darkText }}>Multi-Session</span>
        </Box>
    )
}

const CompleteFlag: React.FC<StudyCardProps> = ({ study }) => {
    if (!study.completedAt) return null

    return (
        <Box gap
            align="center"
            pad="default"
            css={{ color: colors.blackText, backgroundColor: colors.green, position: 'absolute', borderBottomLeftRadius: 20, borderTopLeftRadius: 20, right: 0, top: 40 }}
        >
            <Icon icon="checkCircle" color='white' />
            <span>Complete</span>
        </Box>
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
            role={'link'}
            className="col study"
            direction='column'
            data-study-id={study.id}
            data-is-completed={!!study.completedAt}
            onClick={onClick}
            css={{ position: 'relative' }}
        >
            <Image.image name={Image.title} height="200px" css={{ marginBottom: 20, border: `1px solid ${colors.lightGray}`, borderRadius: 8 }} />
            <CompleteFlag study={study} />
            <Box justify='between'>
                <Feedback study={study} />
                <MultiSession study={study} />
            </Box>
            <h5>{study.title}</h5>
            <Researchers study={study} />
            <p css={{ color: colors.grayText }}>{study.shortDescription}</p>
            <Box flex />
            <Box css={{ fontSize: '14px' }} justify="between" wrap>
                <Box gap>
                    <Tag tag={tagOfType(study, 'topic')} />
                    {tagsOfType(study, 'subject').map(tag => <Tag key={tag} tag={tag} />)}
                </Box>
                <Box gap>

                    <div css={{ marginLeft: '0.5rem' }}>{study.durationMinutes} min</div>
                    {study.participationPoints && <span>• {study.participationPoints}pts</span>}
                </Box>
            </Box>

        </Card>
    )

}
