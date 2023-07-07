import * as Yup from 'yup'
import { Analysis, AnalysisRun } from '@api';
import { useQuery } from 'react-query';
import { useMemo } from '@common';
import { useApi } from '@lib';
import { last } from 'lodash-es';

export const getLastRun = (analysis: Analysis) => {
    return last(analysis.runs)
}

export const getAnalysisValidationSchema = (analyses: Analysis[], analysis: Analysis) => {
    const allOtherAnalyses = useMemo(() => {
        return analysis.id ? analyses?.filter(a => a.id != analysis.id) : analyses
    }, [analyses, analysis])
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

export const isRunUnderReview = (run: AnalysisRun) => {
    return !run.finishedAt
}

export const runHasError = (run: AnalysisRun) => {
    return run.finishedAt && !run.didSucceed
}

export const hasRunSucceeded = (run: AnalysisRun) => {
    return run.finishedAt && run.didSucceed
}
