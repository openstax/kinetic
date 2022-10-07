import { useEffect, useState, useMemo, useCallback } from '@common'
import { useLocalstorageState } from 'rooks'
import { tagOfType } from '@models'
import { ParticipantStudy } from '@api'
import { remove, sortBy, groupBy } from 'lodash'
import { useApi } from '@lib'
import {
    isStudyLaunchable, StudyTopicID,
} from '@models'


export type StudyByTopics = Record<StudyTopicID, ParticipantStudy[]>
const MS_IN_MONTH = 1000 * 60 * 60 * 24 * 30
const FEATURED_COUNT = 3

interface StudySort {
    lastCalculated: number
    sort: Record<number, number>
}

interface StudyState {
    mandatoryStudy?: ParticipantStudy
    allStudies: ParticipantStudy[]
    highlightedStudies: ParticipantStudy[]
    studiesByTopic: StudyByTopics
}

export const useLearnerStudies = () => {
    const api = useApi()
    const [studySort, setStudySort] = useLocalstorageState<StudySort>('learner-studies-order', {
        lastCalculated: Date.now(),
        sort: {},
    })
    studySort.sort = (studySort.sort || {}) // value from localStorage might not have "sort" key
    const [filter, setFilter] = useState<StudyTopicID>('topic:personality')
    const [studies, setStudyState] = useState<StudyState>({
        allStudies: [],
        highlightedStudies: [],
        studiesByTopic: {} as StudyByTopics,
    })

    const fetchStudies = useCallback(async () => {
        const fetchedStudies = await api.getParticipantStudies()

        const mandatoryStudy = fetchedStudies.data?.find(s => isStudyLaunchable(s) && s.isMandatory)

        if (studySort.lastCalculated < Date.now() - MS_IN_MONTH) {
            studySort.lastCalculated = Date.now()
            studySort.sort = {} // clear values
        }
        const allStudies = sortBy(fetchedStudies.data || [], s => {
            const rnd = studySort.sort[s.id] = (studySort.sort[s.id] || Math.random())
            return rnd * (s.completedAt ? 1 : -1)
        })
        setStudySort({ ...studySort })

        const highlightedStudies = allStudies.filter(s => !s.isMandatory && !s.completedAt).slice(0, FEATURED_COUNT)
        remove(allStudies, s => highlightedStudies.includes(s))

        const studiesByTopic = groupBy(allStudies, (s) => tagOfType(s, 'topic') || 'topic:other') as any as StudyByTopics
        if (!studiesByTopic[filter]) {
            setFilter((Object.keys(studiesByTopic) as Array<StudyTopicID>)[0])
        }
        setStudyState({
            mandatoryStudy, allStudies, highlightedStudies, studiesByTopic,
        })
    }, [setStudyState])


    useEffect(() => {
        fetchStudies()
    }, [])

    const onMandatoryClose = useCallback(() => {
        setStudyState({ ...studies, mandatoryStudy: undefined })
        fetchStudies()
    }, [fetchStudies])

    return useMemo(() => ({
        ...studies,
        filter,
        setFilter,
        onMandatoryClose,
    }), [studies, onMandatoryClose, filter, setFilter])

}
