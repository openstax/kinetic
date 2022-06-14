import { useMemo } from '@common'
import { RewardsScheduleSegment, ParticipantStudy } from '@api'
import { useEnvironment } from '@lib'
import { sortBy, last } from 'lodash-es'

export interface CalculatedRewardsScheduleSegment extends RewardsScheduleSegment {
    totalPoints: number
    index: number
}

export function rewardPointsEarned(firstSegment: RewardsScheduleSegment, studies: ParticipantStudy[]): number {
    return studies.reduce((points, study) => {
        if (study.completedAt && study.completedAt > firstSegment.startAt && study.participationPoints) {
            return points + study.participationPoints
        }
        return points
    }, 0)
}

export const useRewardsSchedule = (studies: ParticipantStudy[]) => {
    const env = useEnvironment()

    const rs = env?.config.rewardsSchedule || []
    sortBy(rs, 'startAt')
    let totalPoints = 0

    const allEvents = rs.map((s, index) => {
        totalPoints += s.points
        return {
            ...s,
            index,
            totalPoints,
        } as CalculatedRewardsScheduleSegment
    })

    // earned points cannot be greater than total points
    const pointsEarned = useMemo(() => Math.min(
        totalPoints,
        rewardPointsEarned(rs[0], studies)
    ),[rs, totalPoints, studies])

    return {
        schedule: allEvents.slice(0, -1),
        pointsEarned,
        totalPoints,
        finalDrawing: last(allEvents),
        isCompleted: pointsEarned >= totalPoints,
    }
}
