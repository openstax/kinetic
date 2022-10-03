import { useEffect, useState, useMemo, useCallback } from '@common'
import { useLocalstorageState } from 'rooks'
import { tagOfType } from '@models'
import { ParticipantStudy } from '@api'
import { sampleSize, sortBy, groupBy, xorBy, shuffle } from 'lodash'
import { useApi } from '@lib'
import {
    isStudyLaunchable, StudyTopicID,
} from '@models'

export type StudyByTopics = Record<StudyTopicID, ParticipantStudy[]>
const MS_IN_MONTH = 1000 * 60 * 60 * 24 * 30

interface StudyState {
    lastCalculated: number
    mandatoryStudy?: ParticipantStudy
    allStudies: ParticipantStudy[]
    highlightedStudies: ParticipantStudy[]
    studiesByTopic: StudyByTopics
}

export const useLearnerStudies = () => {
    const api = useApi()

    const [filter, setFilter] = useState<StudyTopicID>('topic:personality')
    const [studies, setStudyState] = useLocalstorageState<StudyState>('learner-studies', {
        lastCalculated: Date.now(),
        allStudies: [],
        highlightedStudies: [],
        studiesByTopic: {} as StudyByTopics,
    })

    const fetchStudies = useCallback(async () => {
        const fetchedStudies = (await api.getParticipantStudies())?.data || []
        const mandatoryStudy = fetchedStudies.find(s => isStudyLaunchable(s) && s.isMandatory)

        // compare the two arrays using the study id property.
        // recalculate if it's been more than 30 days or if there are changes
        if (studies.lastCalculated < Date.now() - MS_IN_MONTH ||
            xorBy(studies.allStudies, fetchedStudies, 'id').length) {

            const allStudies = sortBy(shuffle(fetchedStudies), s => s.completedAt ? 1 : 0)

            const highlightedStudies = sampleSize(allStudies.filter(s => !s.isMandatory && !s.completedAt), 3)

            const studiesByTopic = groupBy(allStudies, (s) => tagOfType(s, 'topic') || 'topic:other') as any as StudyByTopics
            Object.assign(studies, {
                lastCalculated: Date.now(), allStudies, highlightedStudies, studiesByTopic,
            })
        }

        if (!studies.studiesByTopic[filter]) {
            setFilter((Object.keys(studies.studiesByTopic) as Array<StudyTopicID>)[0])
        }

        setStudyState({ ...studies, mandatoryStudy })

    }, [setStudyState])


    useEffect(() => {
        fetchStudies()
    }, [])

    const onMandatoryClose = useCallback(() => {
        setStudyState({ ...studies, mandatoryStudy: undefined })
        fetchStudies()
    }, [fetchStudies])

    //    console.log(studies)

    return useMemo(() => ({
        ...studies,
        filter,
        setFilter,
        onMandatoryClose,
    }), [studies, onMandatoryClose, filter, setFilter])
}
