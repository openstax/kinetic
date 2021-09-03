
import * as Yup from 'yup';
import {
    NewStudy, Study, NewStudyCategoryEnum, StudiesApi, ParticipantStudy,
} from '../api'
import dayjs from 'dayjs'
import { isNil } from '@lib'

export type EditingStudy = NewStudy | Study

export enum StudyStatus {
    Active = 'Active', // eslint-disable-line no-unused-vars
    Scheduled = 'Scheduled', // eslint-disable-line no-unused-vars
    Completed = 'Completed', // eslint-disable-line no-unused-vars
}


export const getStatus = (study: Study):StudyStatus => {
    const now = new Date()
    if (study.opensAt && study.opensAt > now) {
        return StudyStatus.Scheduled
    }
    if (study.closesAt && study.closesAt < now) {
        return StudyStatus.Completed
    }
    return StudyStatus.Active
}

export const getStatusName = (study: Study):string => {
    const status = getStatus(study)
    if (status == StudyStatus.Active) return 'Active'
    if (status == StudyStatus.Scheduled) return 'Scheduled'
    if (status == StudyStatus.Completed) return 'Completed'
    return ''
}

export const StudyValidationSchema = Yup.object().shape({
    titleForParticipants: Yup.string().required('Required'),
    shortDescription: Yup.string().required('Required'),
    longDescription: Yup.string().required('Required'),
    durationMinutes: Yup.number().required('Required'),
    category: Yup.string().required('Required').oneOf([
        NewStudyCategoryEnum.CognitiveTask,
        NewStudyCategoryEnum.ResearchStudy,
        NewStudyCategoryEnum.Survey,
    ]),
});


export const LaunchStudy = async (api: StudiesApi, study: {id: number}, options: { preview?: boolean } = {}) => {
    const launch = await api.launchStudy({ id: study.id, preview: options.preview || false})

    window.location.href = launch.url!
    return launch
}

export const isStudyLaunchable = (study: ParticipantStudy) => {
    return Boolean(
        !study.completedAt &&
            (!study.closesAt || dayjs(study.closesAt).isAfter(dayjs()))
    )
}

export function isNewStudy(study: EditingStudy): study is NewStudy {
    return isNil((study as Study).id)
}

export function isParticipantStudy(study?: any): study is ParticipantStudy {
    return study && !isNil((study).id) && !isNil((study).title)
}
