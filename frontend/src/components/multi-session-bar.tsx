import { React, useMemo } from '@common'
import { filter } from 'lodash-es'
import { ParticipantStudy } from '@api'
import plur from 'plur'
import { SegmentedBar, Segment, SegmentCircle } from './segment-bar'

export const MultiSessionBar: FC<{ study: ParticipantStudy }> = ({ study }) => {
    if (!study.stages || study.stages.length < 2) return null

    const perc = filter(study.stages, 'isCompleted').length / study.stages.length

    const [first, last] = study.stages
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
            <Segment key={1} percentage={0}>
                <SegmentCircle achieved={first.isCompleted} />
                <span className="title">{first.title}</span>
            </Segment>
            <Segment key={2} percentage={50}>
                <SegmentCircle
                    achieved={last.isCompleted}
                    current={first.isCompleted}
                    future={!first.isCompleted}
                    past={last.isCompleted}
                />
                <span>{duration}</span>
            </Segment>
            <Segment key={3} percentage={100}>
                <SegmentCircle achieved={last.isCompleted} future={!last.isLaunchable} />
                <span className="title">{last.title}</span>
            </Segment>
        </SegmentedBar>

    )
}
