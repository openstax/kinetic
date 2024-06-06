import { useApi } from '@lib'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useMemo, useState } from 'react';
import Fuse from 'fuse.js'
import { LandStudyRequest, LearningPath, ParticipantStudy } from '@api';
import { orderBy } from 'lodash-es';
import { groupBy } from 'lodash';

const FEATURED_COUNT = 3

export const useFetchParticipantStudies = () => {
    const api = useApi()
    return useQuery('fetchParticipantStudies', async () => {
        const res = await api.getParticipantStudies();
        return orderBy((res.data || []), ['featuredOrder', 'isFeatured', 'completedAt'], ['asc', 'desc', 'desc'])
    })
}

export const useLandStudy = () => {
    const api = useApi()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (params: LandStudyRequest) => await api.landStudy(params),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['fetchParticipantStudies'] })
        },
    })
}

export const useLearningPathStudies = (learningPath?: LearningPath) => {
    const { data: studies = [] } = useFetchParticipantStudies()
    if (!learningPath || !learningPath.id) return []

    const studiesByLearningPath = groupBy(studies, (study) => study.learningPath?.id)
    return studiesByLearningPath[learningPath.id] || []
}

export const useParticipantStudies = () => {
    const { data: studies = [], isLoading } = useFetchParticipantStudies()

    if (isLoading) return {
        studies: [],
        highlightedStudies: [],
        welcomeStudies: [],
        demographicSurvey: null,
        isLoading,
    }

    const eligibleStudies = studies.filter(s => !s.completedAt)

    const allHighlightedStudies = eligibleStudies.filter(s => s.isHighlighted).slice(-1 * FEATURED_COUNT)

    // If less than 3 are featured, grab and fill random studies until we have 3
    const randomlyHighlighted = eligibleStudies
        .filter(s => !s.isHighlighted)
        .slice(-1 * (FEATURED_COUNT - allHighlightedStudies.length))

    const highlightedStudies = allHighlightedStudies.concat(
        allHighlightedStudies.length == FEATURED_COUNT ? [] : randomlyHighlighted
    )

    const demographicSurvey = studies.find(s => s.isDemographicSurvey) || null

    // const welcomeStudies = studies.filter(s => s.isWelcome)
    const welcomeStudies = studies.slice(0, 2)

    return {
        studies,
        welcomeStudies,
        highlightedStudies,
        demographicSurvey,
        isLoading,
    }
}

export const useSearchStudies = () => {
    const [search, setSearch] = useState('')
    const [filteredStudies, setFilteredStudies] = useState<ParticipantStudy[]>([])
    const { isLoading, studies } = useParticipantStudies()

    const fuseOptions = {
        isCaseSensitive: false,
        shouldSort: true,
        includeMatches: true,
        threshold: 0.3,
        keys: [
            'titleForParticipants',
            'researchers.firstName',
            'researchers.lastName',
        ],
    };

    const fuse = new Fuse(studies, fuseOptions);

    useMemo(() => {
        if (search) {
            const mappedResults = fuse.search(search).map(result => result.item)
            setFilteredStudies(mappedResults)
        } else {
            setFilteredStudies(studies)
        }
    }, [search, isLoading])

    return {
        search,
        setSearch,
        filteredStudies,
    }
}
