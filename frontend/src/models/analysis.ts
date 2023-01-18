import * as Yup from 'yup'

export const AnalysisValidationSchema = Yup.object().shape({
    title: Yup.string().required('Required'),
    repositoryUrl: Yup.string().url().required(),
})
