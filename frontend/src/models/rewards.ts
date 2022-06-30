import { useMemo } from '@common'
import { RewardsScheduleSegment, ParticipantStudy } from '@api'
import { useEnvironment, dayjs } from '@lib'
import { sortBy } from 'lodash-es'

export interface CalculatedRewardsScheduleSegment extends RewardsScheduleSegment {
    totalPoints: number
    pointsEarned: number
    achieved: boolean
    index: number
    isPast: boolean
    isCurrent: boolean
    isFuture: boolean
    isFinal: boolean
    justStarted: boolean
    previousSegment: CalculatedRewardsScheduleSegment | null
}

export function rewardPointsEarned(schedule: RewardsScheduleSegment[], studies: ParticipantStudy[]): number {
    const first = schedule[0], last = schedule[schedule.length - 1]
    if (!first || !last) return 0

    return studies.reduce((points, study) => {
        //        if (study.id == 66) console.log(study.id, first.startAt, study.completedAt)
        if (study.completedAt &&
            study.completedAt > first.startAt &&
            study.completedAt < last.endAt &&
            study.participationPoints
        ) {
            //    console.log(study.id, study.participationPoints, first.startAt, study.completedAt)
            return points + study.participationPoints
        }
        return points
    }, 0)
}


const calculatePoints = (segment: RewardsScheduleSegment, cycleStart: Date, studies: ParticipantStudy[]): number => {
    return studies.reduce((points, study) => {
        if (study.completedAt &&
            study.participationPoints &&
            study.completedAt <= segment.endAt &&
            study.completedAt >= cycleStart
        ) {
            return points + study.participationPoints
        }
        return points
    }, 0)
}

export const useRewardsSchedule = (studies: ParticipantStudy[]) => {
    const env = useEnvironment()

    const rs = sortBy(env?.config.rewardsSchedule || [], 'startAt')
    const firstSegment = rs[0]

    let totalPoints = 0
    const now = dayjs()


    let previousSegment: CalculatedRewardsScheduleSegment | null = null

    const allEvents = rs.map((s, index) => {
        totalPoints += s.points

        const pointsEarned = calculatePoints(s, firstSegment.startAt, studies)

        //console.log(pointsEarned, pointsEarned >= s.points, s)
        previousSegment = {
            ...s,
            index,
            totalPoints,
            pointsEarned,
            previousSegment,
            isFinal: index == rs.length - 1,
            isCurrent: now.isBetween(s.startAt, s.endAt),
            justStarted: now.subtract(1, 'day').isBefore(s.startAt),
            isFuture: now.isBefore(s.startAt),
            isPast: now.isAfter(s.endAt),
            achieved: pointsEarned >= totalPoints,
        } as CalculatedRewardsScheduleSegment

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
        //   finalDrawing: last(allEvents),
        isCompleted: pointsEarned >= totalPoints,
    }
}
