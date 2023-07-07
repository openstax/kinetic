import { React, useEffect, useNavigate, useParams, useState } from '@common'
import {
    Alert,
    Box,
    Col,
    FieldErrorMessage,
    FieldTitle,
    Form,
    InputField,
    PageNotFound,
    Toast,
    useFormState,
} from '@components'
import { Analysis, Study } from '@api'
import { getAnalysisValidationSchema, useFetchAnalyses } from '@models'
import { errorToString, useApi, useQueryParam } from '@lib'
import { SelectedStudies } from './selected-studies'
import { FormSaveButton } from '@nathanstitt/sundry/form';
import { ResearcherFAQ } from './researcher-faq';

interface EditAnalysisProps {
    analyses: Analysis[]
    studies: Study[]
}

const newAnalysis: Analysis = {
    title: '',
    description: '',
    studies: [],
}

const useDefaultStudy = (studies: Study[], analyses: Analysis[]) => {
    const [studyTitle, setStudyTitle] = useState<string>('')
    const [study, setStudy] = useState<Study | null>(null)

    const studyId = useQueryParam<number>('studyId') || null
    useEffect(() => {
        if (studyId) {
            const study = studies.find(s => s.id == studyId) || null
            setStudy(study)
            if (study) {
                const analysisCopy = analyses.find(a => a.title.toLowerCase().trim() === study.titleForResearchers.toLowerCase().trim())
                if (analysisCopy) {
                    setStudyTitle(`${analysisCopy.title} (copy)`)
                } else {
                    setStudyTitle(study.titleForResearchers)
                }
            }
        }

    }, [studyId, studies])

    return { study, studyTitle }
}


export const EditAnalysis: FC<EditAnalysisProps> = ({ analyses, studies }) => {
    const { analysisId } = useParams<string>();
    const studyId = useQueryParam<number>('studyId') || null
    const api = useApi()
    const nav = useNavigate()
    const { study, studyTitle } = useDefaultStudy(studies, analyses)

    const analysis = (!analysisId || analysisId == 'new') ?
        newAnalysis : analyses.find(a => String(a.id) == analysisId)

    const [error, setError] = useState('')

    const { refetch } = useFetchAnalyses()

    const saveAnalysis = async (analysis: Analysis) => {
        try {
            if (analysis.id) {
                const updatedAnalysis = await api.updateAnalysis({ id: analysis.id, updateAnalysis: { analysis } })
                Toast.show({
                    message: `Successfully updated analysis ${updatedAnalysis.title}`,
                })
                await refetch()
                nav(`/analysis/overview/${updatedAnalysis.id}`)
            } else {
                const savedAnalysis = await api.addAnalysis({ addAnalysis: { analysis } })
                Toast.show({
                    message: `Successfully created analysis ${analysis.title}`,
                })
                await refetch()
                nav(`/analysis/overview/${savedAnalysis.id}`)
            }
        } catch (err) {
            setError(await errorToString(err))
        }
    }

    if (!analysis) return <PageNotFound name="Analysis" />

    return (
        <div className="container analysis mt-2">
            <Form
                onSubmit={saveAnalysis}
                defaultValues={{
                    ...analysis,
                    title: analysis.title || studyTitle,
                    description: analysis.description || study?.internalDescription || '',
                    studyIds: studyId ? [...(analysis?.studyIds || []), Number(studyId) ] : analysis.studyIds,
                }}
                validationSchema={getAnalysisValidationSchema(analyses, analysis)}
            >
                <Alert warning={true} onDismiss={() => setError('')} message={error} />
                <Col gap='large'>
                    <Box justify='between'>
                        <h3 className='fw-bold'>Analysis Basics</h3>
                        <ResearcherFAQ />
                    </Box>
                    <Title />
                    <Objectives />
                    <SelectedStudies studies={studies} />
                </Col>

                <BottomBar />
            </Form>

        </div>
    )
}

const Title = () => {
    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <FieldTitle required>Analysis Title</FieldTitle>
                <small>
                    This is an internal title to help you organize your analysis reports. This title is only visible to you
                </small>
            </Col>

            <Col sm={4} direction='column' gap>
                <InputField name='title' type='textarea'/>
                <FieldErrorMessage name='title' liveCountMax={100}/>
            </Col>
        </Box>
    )
}

const Objectives = () => {
    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <FieldTitle required>Analysis Objectives</FieldTitle>
                <small>
                    Clearly define your objectives for running this analysis with emphasis on the questions you’re hoping to investigate
                </small>
            </Col>

            <Col sm={4} direction='column' gap>
                <InputField name='description' type='textarea'/>
                <FieldErrorMessage name='description' liveCountMax={250}/>
            </Col>
        </Box>
    )
}

const BottomBar = () => {
    const { isValid } = useFormState()

    return (
        <Box className='fixed-bottom bg-white mt-auto' css={{ minHeight: 80, boxShadow: `0px -3px 10px rgba(219, 219, 219, 0.5)` }}>
            <Box className='container-lg' align='center' justify='end'>
                <FormSaveButton
                    data-testid='save-analysis-button'
                    className='btn-researcher-primary'
                    disabled={!isValid}
                >
                    Save & Continue
                </FormSaveButton>
            </Box>
        </Box>
    )
}
