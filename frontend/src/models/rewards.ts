import { useMemo } from '@common'
import { AddReward, ParticipantStudy, RewardsScheduleSegment, UpdateRewardRequest } from '@api'
import { dayjs, useApi, useEnvironment } from '@lib'
import { sortBy } from 'lodash-es'
import { useMutation, useQuery, useQueryClient } from 'react-query';
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

export const calculateTotalPoints = (studies: ParticipantStudy[]): number => {
    return studies.reduce((points, study) => {
        if (study.completedAt &&
            study.totalPoints &&
            study.consented
        ) {
            return points + study.totalPoints
        }
        return points
    }, 0)
}

export const useFetchRewards = () => {
    const api = useApi()
    return useQuery('fetchRewards', async () => {
        const res = await api.getRewards();
        return res.data || [];
    })
}

export const useCreateReward = () => {
    const api = useApi()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (addReward: AddReward) => await api.createReward({ addReward }),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: ['fetchRewards'] })
            return data
        },
    })
}

export const useUpdateReward = () => {
    const api = useApi()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (updateRewardRequest: UpdateRewardRequest) => await api.updateReward({
            updateReward: updateRewardRequest.updateReward,
            id: updateRewardRequest.id,
        }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['fetchRewards'] })
        },
    })
}

export const useDeleteReward = () => {
    const api = useApi()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => await api.deleteReward({ id }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['fetchRewards'] })
        },
    })
}
