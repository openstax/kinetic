import { useCallback, useEffect, useMemo, useState } from '@common'
import { useLocalstorageState } from 'rooks'
import { StudyTopic } from '@models'
import { ParticipantStudy } from '@api'
import { groupBy, sortBy } from 'lodash'
import { useApi } from '@lib'
import { useQuery } from 'react-query';


export type StudyByTopics = Record<StudyTopic, ParticipantStudy[]>
const MS_IN_MONTH = 1000 * 60 * 60 * 24 * 30
const FEATURED_COUNT = 3

interface StudySort {
    lastCalculated: number
    sort: Record<number, number>
}

interface StudyState {
    allStudies: ParticipantStudy[]
    highlightedStudies: ParticipantStudy[]
    syllabusContestStudies: ParticipantStudy[]
    studiesByTopic: StudyByTopics
    demographicSurvey: ParticipantStudy | null
}

export const useFetchParticipantStudies = () => {
    const api = useApi()
    return useQuery('fetchParticipantStudies', async () => {
        const res = await api.getParticipantStudies();
        return (res.data || []).sort(study => study.completedAt ? 1 : -1);
    })
}

export const useDemographicSurvey = () => {
    const { data: studies, isLoading } = useFetchParticipantStudies()
    if (isLoading) return null
    return studies?.find(s => s.isDemographicSurvey) || null
}


// Add methods to get all data derived from this,
// rather than return it all in one hook
export const useParticipantStudies = () => {
    const { data: studies, isLoading } = useFetchParticipantStudies()

    if (isLoading) return []
    return studies
}


// The rules for featured studies are:
//   * select all the non-completed studies
//   * Sort the list.  See if we've sorted the above list in the last 30 days.
//      * If we have, re-apply the sort
//      * If not, sort it and remember how and when it was sorted
//      * List is sorted randomly, but always moves completed studies to the end of the list
//   * Find the first 3 studies that are marked as featured
//   * If we didn't find 3, pick the remainder from the end of the sorted list

export const useLearnerStudies = () => {
    const api = useApi()
    const [studySort, setStudySort] = useLocalstorageState<StudySort>('learner-studies-order', {
        lastCalculated: Date.now(),
        sort: {},
    })
    studySort.sort = (studySort.sort || {}) // value from localStorage might not have "sort" key
    const [filter, setFilter] = useState<StudyTopic>('Personality')
    const [studies, setStudyState] = useState<StudyState>({
        allStudies: [],
        highlightedStudies: [],
        syllabusContestStudies: [],
        studiesByTopic: {} as StudyByTopics,
        demographicSurvey: null,
    })

    const fetchStudies = useCallback(async () => {
        const fetchedStudies = await api.getParticipantStudies()

        if (studySort.lastCalculated < Date.now() - MS_IN_MONTH) {
            studySort.lastCalculated = Date.now()
            studySort.sort = {} // clear values
        }

        const allStudies = sortBy(fetchedStudies.data || [], s => {
            const rnd = studySort.sort[s.id] = (studySort.sort[s.id] || Math.random())
            return rnd * (s.completedAt ? 1 : -1)
        })

        setStudySort({ ...studySort })

        const demographicSurvey = allStudies.find(s => s.isDemographicSurvey) || null

        // find all studies that are eligible to be featured
        const eligibleStudies = allStudies.filter(s => !s.completedAt)

        // select 3 that are marked as featured
        const featuredStudies = eligibleStudies.filter(s => s.isFeatured).slice(-1 * FEATURED_COUNT)

        // Get the syllabus contest studies
        const syllabusContestStudies = sortBy(allStudies.filter(s => s.isSyllabusContestStudy), ['id'])

        // If less than 3 are featured, grab and fill random studies until we have 3
        const randomlyFeatured = eligibleStudies
            .filter(s => !s.isFeatured)
            .slice(-1 * (FEATURED_COUNT - featuredStudies.length))

        const highlightedStudies = featuredStudies.concat(
            featuredStudies.length == FEATURED_COUNT ? [] : randomlyFeatured
        )

        const nonHighlightedStudies = allStudies.filter(s => !highlightedStudies.includes(s))

        const studiesByTopic = groupBy(nonHighlightedStudies, (s) => s.topic) as StudyByTopics

        if (!studiesByTopic[filter]) {
            setFilter((Object.keys(studiesByTopic) as Array<StudyTopic>)[0])
        }

        setStudyState({
            allStudies,
            highlightedStudies,
            syllabusContestStudies,
            studiesByTopic,
            demographicSurvey,
        })
    }, [setStudyState])


    useEffect(() => {
        fetchStudies()
    }, [])

    return useMemo(() => ({
        ...studies,
        filter,
        setFilter,
    }), [studies, filter, setFilter])

}
