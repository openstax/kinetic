import * as Yup from 'yup'
import { Analysis, DefaultApi } from '@api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useMemo } from '@common';
import { useApi } from '@lib';

export const getAnalysisValidationSchema = (analyses: Analysis[], analysis: Analysis) => {
    const allOtherAnalyses = useMemo(() => analyses?.filter(a => 'id' in analysis && a.id !== analysis.id), [analyses])

    return Yup.object().shape({
        title: Yup.string().required('Required').test(
            'Unique',
            'This analysis title is already in use. Please change your title to make it unique on Kinetic.',
            (value?: string) => {
                if (!analyses.length) {
                    return true
                }
                return allOtherAnalyses.every(analysis => analysis.title?.toLowerCase().trim() !== value?.toLowerCase().trim())
            }
        ),
        description: Yup.string().required('Required').max(250),
        studyIds: Yup.array().test(
            'At least one',
            'Select at least one study',
            (studyIds?: number[]) => (studyIds?.length || 0) > 0
        ),
    })
}

export const useFetchAnalyses = () => {
    const api = useApi()
    return useQuery('fetchAnalyses', () => {
        return api.listAnalysis().then(res => res.data || [])
    })
}

export const useFetchAnalysis = (id: number) => {
    const api = useApi()
    return useQuery('fetchAnalysisById', () => {
        return api.getAnalysis({ id: id })
    })
}

// TODO Remove these, too fancy for now
export const useCreateAnalysis = () => {
    const api = useApi()

    return (analysis: Analysis) => {
        console.log(analysis)
    }
}

export const useUpdateAnalysis = () => {
    const api = useApi()
    const queryClient = useQueryClient()
    const analysisUpdate = useMutation({
        mutationFn: (analysis: Analysis) => {
            return api.updateAnalysis({ id: analysis.id, updateAnalysis: { analysis } })
        },
        onMutate: async (newAnalysis) => {
            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['analyses', newAnalysis.id] })

            // Snapshot the previous value
            const previousAnalysis = queryClient.getQueryData(['analyses', newAnalysis.id])

            // Optimistically update to the new value
            queryClient.setQueryData(['analyses', newAnalysis.id], newAnalysis)
            // Return a context object with the snapshotted value
            return { previousAnalysis }
        },
        // If the mutation fails,
        // use the context returned from onMutate to roll back
        onError: (err, newAnalysis, context) => {
            queryClient.setQueryData(['analyses', newAnalysis.id], context?.previousAnalysis)
        },
        onSuccess: (updatedAnalysis, variables) => {
            queryClient.setQueryData<Analysis[] | undefined>(['analyses', { id: variables.id }], (old) => [
                ...old || [], updatedAnalysis,
            ])
        },
    })
    return (analysis: Analysis) => {
        return analysisUpdate.mutateAsync(analysis)
    }
}

export const useCreateOrUpdateAnalysis = () => {
    const api = useApi()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (analysis: Analysis) => {
            if (analysis.id) {
                return api.updateAnalysis({ id: analysis.id, updateAnalysis: { analysis } })
            } else {
                return api.addAnalysis({ addAnalysis: { analysis } })
            }
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['analyses', { id: variables.id }], data)
        },
    })
}
