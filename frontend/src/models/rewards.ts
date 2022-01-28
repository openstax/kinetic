import { useMemo } from '@common'
import { RewardsScheduleSegment, ParticipantStudy } from '@api'
import { useEnv } from './environment'
import { sortBy, last } from 'lodash-es'
import { useRewardsState } from '../lib/reward-status'

export interface CalculatedRewardsScheduleSegment extends RewardsScheduleSegment {
    totalPoints: number
    index: number
}

export function rewardPointsEarned(studies: ParticipantStudy[]): number {
    return studies.reduce((points, study) => {
        if (study.participationPoints && study.completedAt) {
            return points + study.participationPoints
        }
        return points
    }, 0)
}

export const useRewardsSchedule = (studies: ParticipantStudy[]) => {
    const env = useEnv()
    const rewardsState = useRewardsState()

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
        rewardsState,
        schedule: allEvents.slice(0, -1),
        points,
        totalPoints,
        finalDrawing: last(allEvents),
        isCompleted: points >= totalPoints,
    }
}
