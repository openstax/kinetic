import { DefaultApi, ParticipantStudy, ResearcherRoleEnum, Stage, Study, StudyStatusEnum } from '@api'
import { isNil, useApi } from '@lib'
import { dayjs, useEffect, useState } from '@common';
import { first, sumBy } from 'lodash-es';
import { useQuery } from 'react-query';
import { showResearcherNotificationError } from '@components';

export enum StudyStatus {
    Launched = 'Launched',
    Draft = 'Draft',
    Completed = 'Completed',
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
        && (!study.closesAt || dayjs(study.closesAt).isAfter(dayjs()))
        && areStudyStagesLaunchable(study)
    )
}

export const getStudyEditUrl = (study: Study) => {
    if (isDraft(study)) {
        return `/study/edit/${study.id}`
    }

    return `/study/overview/${study.id}`
}

export function getFirstStage(study: Study | ParticipantStudy): Stage | undefined {
    return first(study.stages)
}

export function isActive(study: Study) {
    return study.status === StudyStatusEnum.Active
}

export function isWaiting(study: Study) {
    return study.status === StudyStatusEnum.WaitingPeriod
}

export function isReadyForLaunch(study: Study) {
    return study.status === StudyStatusEnum.ReadyForLaunch
}

export function isDraft(study: Study) {
    return study.status === StudyStatusEnum.Draft
}

export function isDraftLike(study: Study) {
    return isDraft(study) || isWaiting(study) || isReadyForLaunch(study)
}

export function isPaused(study: Study) {
    return study.status === StudyStatusEnum.Paused
}

export function isScheduled(study: Study) {
    return study.status === StudyStatusEnum.Scheduled
}

export function isCompleted(study: Study) {
    return study.status === StudyStatusEnum.Completed
}

export function getStudyPi(study: Study | ParticipantStudy) {
    return study.researchers?.find(r => r.role === ResearcherRoleEnum.Pi)
}

export function getStudyLead(study: Study | ParticipantStudy) {
    return study.researchers?.find(r => r.role === ResearcherRoleEnum.Lead)
}

export function isParticipantStudy(study?: any): study is ParticipantStudy {
    return study && !isNil((study).id) && !isNil((study).titleForParticipants)
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

    return sumBy(study.stages, (s) => +(s.points || 0))
}

export function getStudyDuration(study: ParticipantStudy): number {
    if (!study.stages) return 0

    return sumBy(study.stages, (s) => +(s.durationMinutes || 0))
}

export const useFetchPublicStudies = () => {
    const api = useApi()
    return useQuery('fetchPublicStudies', () => {
        return api.getPublicStudies().then(res => res.data || [])
    })
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

export const useFetchStudy = (id: string) => {
    const api = useApi()
    const [study, setStudy] = useState<Study | null>()
    const [allStudies, setAllStudies] = useState<Study[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const isNew = 'new' === id

    useEffect(() => {
        api.getStudies().then(studies => {
            setLoading(false)
            setAllStudies(studies.data || [])
            if (isNew) {
                return setStudy({
                    id: -1,
                    titleForResearchers: '',
                    internalDescription: '',
                })
            }
            const study = studies.data?.find(s => s.id == Number(id))
            if (study) {
                setStudy(study)
            } else {
                showResearcherNotificationError(`Study with id ${id} not found`)
            }
        })
    }, [id])

    return { loading, study, setStudy, allStudies, setAllStudies }
}

export type StudyCategory = 'Cognitive Task & Assessment' | 'Learner Characteristics' | 'Educational Research' | 'Product & Organizational Research' | 'Transfer of Learning'
export const studyCategories: StudyCategory[] = [
    'Cognitive Task & Assessment',
    'Learner Characteristics',
    'Educational Research',
    'Product & Organizational Research',
    'Transfer of Learning',
]

export const studyCategoryDescriptions = {
    'Cognitive Task & Assessment': 'Measures of human cognition, such as working memory, reasoning, and problem-solving, as well as prior knowledge and skills',
    'Learner Characteristics': 'Individual differences measures related to learning and education that provide insight into who is the learner',
    'Educational Research': 'Learning and educational studies, such as A/B/N tests, quasi experiments, and single-domain interventional research',
    'Product & Organizational Research': 'Surveys, assessments, and/or interventions related to understanding learner needs, such as product development and UX design',
    'Transfer of Learning': 'Interventions that assess learning or other outcomes across domains',
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
