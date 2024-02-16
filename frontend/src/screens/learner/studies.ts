import { useApi } from '@lib'
import { useQuery } from 'react-query';

const FEATURED_COUNT = 3

export const useFetchParticipantStudies = () => {
    const api = useApi()
    return useQuery('fetchParticipantStudies', async () => {
        const res = await api.getParticipantStudies();
        return (res.data || []).sort(study => study.completedAt ? 1 : -1);
    })
}

// Add methods to get all data derived from this,
// rather than return it all in one hook
export const useParticipantStudies = () => {
    const { data: studies, isLoading } = useFetchParticipantStudies()
    if (isLoading || !studies) return {
        studies: [],
        highlightedStudies: [],
        demographicSurvey: null,
        allStudies: [],
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
    }
}
