import { React, useMemo } from '@common'
import { filter } from 'lodash-es'
import { ParticipantStudy } from '@api'
import plur from 'plur'
import { colors } from '../theme'
import { SegmentedBar, Segment, SegmentTitle, SegmentCircle } from './segment-bar'
import { Icon } from './icon'

export const MultiSessionBar: FC<{ study: ParticipantStudy }> = ({ study }) => {
    if (!study.stages || study.stages.length < 2) return null


    const [first, last] = study.stages
    const perc = (filter(study.stages, 'isCompleted').length / study.stages.length) * 100
    const duration = useMemo(() => {
        const d = last.availableAfterDays || 0
        if (d === 0) return 'immediately'
        if (0 === (d % 7)) {
            return `${d / 7} ${plur('week', d / 7)}`
        }
        return `${d} ${plur('day', d)}`
    }, [last.availableAfterDays])

    return (
        <SegmentedBar completedPercentage={perc} css={{ margin: '0 15px' }}>
            <Segment key={1} percentage={40}
                css={{
                    alignItems: 'flex-start',
                }}
            >
                <SegmentCircle achieved={first.isCompleted} />
                <SegmentTitle>{first.title}</SegmentTitle>
            </Segment>
            <Segment key={2} percentage={20}
                css={{
                    alignItems: 'center',
                }}
            >
                <SegmentCircle
                    achieved={last.isCompleted}
                    current={first.isCompleted}
                    future={!first.isCompleted}
                    past={last.isCompleted}
                >
                    <Icon icon="clock" color={colors.purple} />
                </SegmentCircle>
                <SegmentTitle>{duration}</SegmentTitle>
            </Segment>
            <Segment key={3} percentage={40}>
                <SegmentCircle achieved={last.isCompleted} future={!last.isLaunchable} />
                <SegmentTitle>{last.title}</SegmentTitle>
            </Segment>
        </SegmentedBar>

    )
}
