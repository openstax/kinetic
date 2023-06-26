import * as Yup from 'yup'
import { Analysis } from '@api';

export const getAnalysisValidationSchema = (analyses: Analysis[]) => {
    return Yup.object().shape({
        title: Yup.string().required('Required').test(
            'Unique',
            'This analysis title is already in use. Please change your title to make it unique on Kinetic.',
            (value?: string) => {
                if (!analyses.length) {
                    return true
                }
                return analyses.every(analysis => analysis.title?.toLowerCase().trim() !== value?.toLowerCase().trim())
            }
        ),
        repositoryUrl: Yup.string().url().required(),
    })
}
