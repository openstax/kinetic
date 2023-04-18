import * as Yup from 'yup'
import { DefaultApi, NewStudy, ParticipantStudy, Study } from '@api'
import { isNil, useApi } from '@lib'
import { useEffect, useState } from '@common';
import { first, sumBy } from 'lodash-es';

export type EditingStudy = NewStudy | Study
export type SavedStudy = Study | ParticipantStudy

export enum StudyStatus {
    Launched = 'Launched', // eslint-disable-line no-unused-vars
    Draft = 'Draft', // eslint-disable-line no-unused-vars
    Completed = 'Completed', // eslint-disable-line no-unused-vars
}

export const StudyValidationSchema = Yup.object().shape({
    titleForParticipants: Yup.string().required('Required'),
    shortDescription: Yup.string().required('Required'),
    longDescription: Yup.string().required('Required'),
    tags: Yup.array().of(Yup.string()).test(
        'has-type',
        'studies must have a type set',
        (tags) => Boolean(tags?.find(t => t?.match(/^type:/)))
    ).test(
        'has-topic',
        'studies must have a topic set',
        (tags) => Boolean(tags?.find(t => t?.match(/^topic:/)))
    ),
});


export const LaunchStudy = async (api: DefaultApi, study: { id: number }, options: { preview?: boolean } = {}) => {
    const launch = await api.launchStudy({ id: study.id, preview: options.preview || false })
    window.location.assign(launch.url!)
    return launch
}

const areStudyStagesLaunchable = (study: ParticipantStudy) => {
    if (!study.stages) {
        return false
    }
    return Boolean(study.stages.find(s => !s.isCompleted && s.isLaunchable))
}

export const isStudyLaunchable = (study: ParticipantStudy) => {
    return Boolean(
        !study.completedAt
        // && (!study.closesAt || dayjs(study.closesAt).isAfter(dayjs()))
        && areStudyStagesLaunchable(study)
    )
}

export function isStudy(study: EditingStudy): study is Study {
    return !isNil((study as Study).id)
}

export function isNewStudy(study: EditingStudy): study is NewStudy {
    return isNil((study as Study).id)
}

export function isParticipantStudy(study?: any): study is ParticipantStudy {
    return study && !isNil((study).id) && !isNil((study).title)
}

export function studyIsMultipart(study: ParticipantStudy): boolean {
    return Boolean(study.stages && study.stages.length > 1)
}

export function studyHasFeedback(study: ParticipantStudy): boolean {
    if (!study.stages) {
        return false
    }
    return study.stages.some(stage => stage.feedbackTypes && stage.feedbackTypes.length > 0)
}

export function getStudyPoints(study: ParticipantStudy): number {
    if (!study.stages) return 0

    return sumBy(study.stages, 'points')
}

export function getStudyDuration(study: ParticipantStudy): number {
    if (!study.stages) return 0

    return sumBy(study.stages, 'durationMinutes')
}

export function getOpensAt(study: Study): Date | null {
    const firstStage = first(study.stages)
    if (!firstStage || !firstStage.opensAt) return null
    return firstStage.opensAt
}

export function getClosesAt(study: Study): Date | null {
    const firstStage = first(study.stages)
    if (!firstStage || !firstStage.closesAt) return null
    return firstStage.closesAt
}

export const useFetchStudies = () => {
    const api = useApi()
    const [studies, setStudies] = useState<Study[]>([])
    const fetchStudies = () => {
        useEffect(() => {
            api.getStudies().then(res => {
                setStudies((res.data || []).filter(study => !study.isHidden))
            })
        }, [])
    }

    fetchStudies()

    return { studies, setStudies, fetchStudies }
}

export type StudyTopic = 'Learning' | 'Memory' | 'Personality' | 'School & Career' | 'Other'
export const studyTopics: StudyTopic[] = [
    'Learning',
    'Memory',
    'Personality',
    'School & Career',
    'Other',
]

export type StudySubject = 'Biology' | 'Business Ethics' | 'Chemistry' | 'Physics' | 'Psychology' | 'Sociology' | 'Statistics' | 'US History'

export const studySubjects: StudySubject[] = [
    'Biology',
    'Business Ethics',
    'Chemistry',
    'Physics',
    'Psychology',
    'Sociology',
    'Statistics',
    'US History',
]
