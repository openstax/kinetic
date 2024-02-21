import { useApi } from '@lib'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useMemo, useState } from 'react';
import Fuse from 'fuse.js'
import { LandStudyRequest, ParticipantStudy } from '@api';


const FEATURED_COUNT = 3

export const useFetchParticipantStudies = () => {
    const api = useApi()
    return useQuery('fetchParticipantStudies', async () => {
        const res = await api.getParticipantStudies();
        return (res.data || []).sort(study => study.completedAt ? 1 : -1);
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

export const useParticipantStudies = () => {
    const { data: studies, isLoading } = useFetchParticipantStudies()

    if (isLoading || !studies) return {
        studies: [],
        highlightedStudies: [],
        demographicSurvey: null,
        nonHighlightedStudies: [],
        allStudies: [],
        isLoading,
    }

    const eligibleStudies = studies.filter(s => !s.completedAt)

    const featuredStudies = eligibleStudies.filter(s => s.isFeatured).slice(-1 * FEATURED_COUNT)

    // If less than 3 are featured, grab and fill random studies until we have 3
    const randomlyFeatured = eligibleStudies
        .filter(s => !s.isFeatured)
        .slice(-1 * (FEATURED_COUNT - featuredStudies.length))

    const highlightedStudies = featuredStudies.concat(
        featuredStudies.length == FEATURED_COUNT ? [] : randomlyFeatured
    )

    const nonHighlightedStudies = studies.filter(s => !highlightedStudies.includes(s))

    const demographicSurvey = studies.find(s => s.isDemographicSurvey) || null

    return {
        allStudies: studies,
        nonHighlightedStudies,
        highlightedStudies,
        demographicSurvey,
        isLoading,
    }
}

export const useSearchStudies = () => {
    const [search, setSearch] = useState('')
    const [filteredStudies, setFilteredStudies] = useState<ParticipantStudy[]>([])
    const { isLoading, nonHighlightedStudies } = useParticipantStudies()

    const fuseOptions = {
        isCaseSensitive: false,
        shouldSort: true,
        includeMatches: true,
        threshold: 0.3,
        keys: [
            'titleForParticipants',
            'researchers.firstName',
            'researchers.lastName',
            'topic',
        ],
    };

    const fuse = new Fuse(nonHighlightedStudies, fuseOptions);

    useMemo(() => {
        if (search) {
            const mappedResults = fuse.search(search).map(result => result.item)
            setFilteredStudies(mappedResults)
        } else {
            setFilteredStudies(nonHighlightedStudies)
        }
    }, [search, isLoading])

    return {
        search,
        setSearch,
        filteredStudies,
    }
}
