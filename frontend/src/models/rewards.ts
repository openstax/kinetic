import { useMemo } from '@common'
import { RewardsScheduleSegment, ParticipantStudy } from '@api'
import { useEnvironment, dayjs, useApi } from '@lib'
import { sortBy } from 'lodash-es'
import { useQuery } from 'react-query';
import { useParticipantStudies } from '../screens/learner/studies';

export interface RewardsSegment extends RewardsScheduleSegment {
    totalPoints: number
    pointsEarned: number
    achieved: boolean
    index: number
    isPast: boolean
    isCurrent: boolean
    isFuture: boolean
    isFinal: boolean
    recentlyAchieved: boolean
    previousSegment: RewardsSegment | null
}

export function rewardPointsEarned(schedule: RewardsScheduleSegment[], studies: ParticipantStudy[]): number {
    const first = schedule[0], last = schedule[schedule.length - 1]
    if (!first || !last) return 0

    return studies.reduce((points, study) => {
        if (study.completedAt &&
            study.completedAt > first.startAt &&
            study.completedAt < last.endAt &&
            study.totalPoints
        ) {
            return points + study.totalPoints
        }
        return points
    }, 0)
}


const calculatePoints = (segment: RewardsScheduleSegment, cycleStart: Date, studies: ParticipantStudy[]): number => {
    return studies.reduce((points, study) => {
        if (study.completedAt &&
            study.totalPoints &&
            study.consented &&
            study.completedAt <= segment.endAt &&
            study.completedAt >= cycleStart
        ) {
            return points + study.totalPoints
        }
        return points
    }, 0)
}

export const useRewardsSchedule = (studies: ParticipantStudy[]) => {
    const env = useEnvironment()
    // TODO Use this instead
    // const studies = useParticipantStudies()

    const rs = sortBy(env.rewardsSchedule, 'startAt')
    const firstSegment = rs[0]

    let totalPoints = 0
    const now = dayjs()

    let previousSegment: RewardsSegment | null = null

    const recentlyEarnedPoints = studies.find(s => (
        s.completedAt && dayjs(s.completedAt).isBetween(now.subtract(1, 'day'), now)
    ))?.totalPoints || 0

    const allEvents = rs.map((s, index) => {
        totalPoints += s.points

        const pointsEarned = calculatePoints(s, firstSegment.startAt, studies)
        const achieved = pointsEarned >= totalPoints
        const isCurrent = now.isBetween(s.startAt, s.endAt)

        previousSegment = {
            ...s,
            index,
            achieved,
            isCurrent,
            recentlyAchieved: achieved && pointsEarned - recentlyEarnedPoints < totalPoints,
            totalPoints,
            pointsEarned,
            previousSegment,
            isFinal: index == rs.length - 1,
            isFuture: now.isBefore(s.startAt),
            isPast: now.isAfter(s.endAt),
        } as RewardsSegment

        return previousSegment
    })

    // earned points cannot be greater than total points
    const pointsEarned = useMemo(() => Math.min(
        totalPoints,
        rewardPointsEarned(rs, studies)
    ), [rs, totalPoints, studies])

    return {
        schedule: allEvents,
        pointsEarned,
        totalPoints,
        isCompleted: pointsEarned >= totalPoints,
    }
}

export const useFetchRewards = () => {
    const api = useApi()
    return useQuery('fetchRewards', () => {
        return api.getRewards()
    })
}

export const useNextReward = () => {
    const env = useEnvironment()
    const rewardSchedule = env.rewardsSchedule
    const today = dayjs()
    return rewardSchedule.find(reward => {
        return today.isBefore(dayjs(reward.endAt))
    })
}
