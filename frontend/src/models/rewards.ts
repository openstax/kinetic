import { useMemo } from '@common'
import { RewardsScheduleSegment, ParticipantStudy } from '@api'
import { useEnvironment } from '@lib'
import { sortBy, last } from 'lodash-es'

export interface CalculatedRewardsScheduleSegment extends RewardsScheduleSegment {
    totalPoints: number
    index: number
}

export function rewardPointsEarned(studies: ParticipantStudy[]): number {
    return studies.reduce((points, study) => {
        if (study.participationPoints && study.completedAt && study.consentGranted) {
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

    const points = useMemo(() => rewardPointsEarned(studies), [studies])

    return {
        schedule: allEvents.slice(0, -1),
        points,
        totalPoints,
        finalDrawing: last(allEvents),
        isCompleted: points >= totalPoints,
    }
}
