import {
    DefaultApi,
    FeaturedStudyIds,
    HighlightedStudyIds,
    ParticipantStudy,
    ResearcherRoleEnum,
    Stage,
    Study,
    StudyStatusEnum,
} from '@api'
import { useApi } from '@lib'
import { dayjs, useEffect, useState } from '@common';
import { find, findLast, first, last, sumBy } from 'lodash-es';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { showResearcherNotificationError } from '@components';
import type { WelcomeStudyIds } from '@api';

export enum StudyStatus {
    Launched = 'Launched',
    Draft = 'Draft',
    Completed = 'Completed',
}

export const launchStudy = async (api: DefaultApi, studyId: number, preview: boolean = false) => {
    const launch = await api.launchStudy({ id: studyId, preview })
    window.location.assign(launch.url)
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

export function getLastStage(study: Study | ParticipantStudy): Stage | undefined {
    return last(study.stages)
}

export function getNextAvailableStage(study: ParticipantStudy): Stage | undefined {
    return find(study.stages, (stage) => !stage.isCompleted) || getLastStage(study)
}

export function getLastCompletedStage(study: ParticipantStudy): Stage | undefined {
    return findLast(study.stages, (stage) => !!stage.isCompleted);
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

export function isMultiSession(study: ParticipantStudy | Study): boolean {
    return Boolean(study.stages && study.stages.length > 1)
}

export function getStudyPoints(study: ParticipantStudy): number {
    if (!study.stages) return 0

    return sumBy(study.stages, (s) => +(s.points || 0))
}

export function getStudyDuration(study: ParticipantStudy): number {
    if (!study.stages) return 0

    return sumBy(study.stages, (s) => +(s.durationMinutes || 0))
}

export const useAdminGetStudies = (status: string = 'all') => {
    const api = useApi()
    return useQuery('adminGetStudies', async () => {
        const res = await api.adminQueryStudies({ status });
        return res.data || [];
    })
}

export const useUpdateHighlightedStudies = () => {
    const api = useApi()
    return useMutation({
        mutationFn: async (highlightedStudyIds: HighlightedStudyIds) => await api.adminHighlightStudies({
            highlightedStudyIds,
        }),
    })
}

export const useUpdateWelcomeStudies = () => {
    const api = useApi()
    return useMutation({
        mutationFn: async (welcomeStudyIds: WelcomeStudyIds) => await api.adminWelcomeStudies({
            welcomeStudyIds,
        }),
    })
}

export const useUpdateFeaturedStudies = () => {
    const api = useApi()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (featuredStudyIds: FeaturedStudyIds) => await api.adminFeatureStudies({
            featuredStudyIds,
        }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['getLearningPaths'] })
        },
    })
}

export const useFetchPublicStudies = () => {
    const api = useApi()
    return useQuery('fetchPublicStudies', async () => {
        const res = await api.getPublicStudies();
        return res.data || [];
    })
}

export const useFetchParticipantStudy = (id: number) => {
    const api = useApi()
    return useQuery('getParticipantStudy', async () => {
        return await api.getParticipantStudy({ id });
    })
}

export const useFetchStudies = () => {
    const api = useApi()
    return useQuery('fetchStudies', async () => {
        const res = await api.getStudies();
        return res.data?.filter(study => !study.isHidden) || [];
    })
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
