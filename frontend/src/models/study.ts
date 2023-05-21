import {
    DefaultApi,
    NewStudy,
    ParticipantStudy,
    ResearcherRoleEnum,
    Stage,
    StageStatusEnum,
    Study,
    StudyStatusEnum,
} from '@api'
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

// TODO can we rely on the backend being up to date? or just use stages?
export function getStudyStatus(study: EditingStudy) {
    if (!study.stages || !study.stages.length) {
        return StageStatusEnum.Draft
    }

    return first(study.stages)?.status
}

export function getFirstStage(study: Study): Stage | undefined {
    return first(study.stages)
}

export function isWaiting(study: EditingStudy) {
    return study.status === StudyStatusEnum.WaitingPeriod
}

export function isReadyForLaunch(study: EditingStudy) {
    return study.status === StudyStatusEnum.ReadyForLaunch
}

export function isDraft(study: EditingStudy) {
    return study.status === StudyStatusEnum.Draft
}

export function getStudyPi(study: EditingStudy) {
    return study.researchers?.find(r => r.role === ResearcherRoleEnum.Pi)
}

export function getStudyLead(study: EditingStudy) {
    return study.researchers?.find(r => r.role === ResearcherRoleEnum.Lead)
}

export function isParticipantStudy(study?: any): study is ParticipantStudy {
    return study && !isNil((study).id) && !isNil((study).title)
}

export function studyIsMultipart(study: ParticipantStudy | Study): boolean {
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
