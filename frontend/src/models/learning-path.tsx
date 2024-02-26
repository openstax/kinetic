import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useApi } from '@lib';
import { AddLearningPath, UpdateLearningPathRequest } from '@api';

export const useFetchLearningPaths = () => {
    const api = useApi()
    return useQuery('getLearningPaths', async () => {
        const res = await api.getLearningPaths();
        return res.data;
    })
}

export const useUpdateLearningPath = () => {
    const api = useApi()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (learningPathRequest: UpdateLearningPathRequest) => {
            const id = learningPathRequest.updateLearningPath.learningPath?.id
            if (!id) return
            await api.updateLearningPath({
                id,
                updateLearningPath: learningPathRequest.updateLearningPath,
            })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['getLearningPaths'] })
            // queryClient.setQueryData(['getLearningPaths', { id: variables.learningPath?.id }], data)
        },
    })
}

export const useCreateLearningPath = () => {
    const api = useApi()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (learningPath: AddLearningPath) => await api.createLearningPath({ addLearningPath: learningPath }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['getLearningPaths'] })
        },
    })
}
