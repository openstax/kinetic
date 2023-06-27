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
    useFormState,
} from '@components'
import { Analysis, Study } from '@api'
import { getAnalysisValidationSchema } from '@models'
import { errorToString, useApi, useQueryParam } from '@lib'
import { SelectedStudies } from './selected-studies'
import { FormSaveButton } from '@nathanstitt/sundry/form';

interface EditAnalysisProps {
    analyses: Analysis[]
    studies: Study[]
    onEditSuccess(): void
}

const newAnalysis: Analysis = {
    title: '',
    description: '',
    studies: [],
}


export const EditAnalysis: FC<EditAnalysisProps> = ({ analyses, studies, onEditSuccess }) => {
    const [study, setStudy] = useState<Study | null>(null)
    const [studyTitle, setStudyTitle] = useState<string>('')
    const { analysisId } = useParams<string>();
    const studyId = useQueryParam<number>('studyId') || null

    useEffect(() => {
        if (studyId) {
            const study = studies.find(s => s.id == studyId) || null
            setStudy(study)
            if (study) {
                const analysisCopy = analyses.find(a => a.title === study.titleForResearchers)
                if (analysisCopy) {
                    setStudyTitle(`${analysisCopy.title} (copy)`)
                } else {
                    setStudyTitle(study.titleForResearchers)
                }
            }
        }

    }, [studyId, studies])

    const analysis = (!analysisId || analysisId == 'new') ?
        newAnalysis : analyses.find(a => String(a.id) == analysisId)

    const nav = useNavigate()
    const api = useApi()

    const [error, setError] = useState('')

    const saveAnalysis = async (analysis: Analysis) => {
        try {
            if (analysis.id) {
                await api.updateAnalysis({ id: analysis.id, updateAnalysis: { analysis } })
            } else {
                const savedAnalysis = await api.addAnalysis({ addAnalysis: { analysis } })
                nav(`/analysis/edit/${savedAnalysis.id}`)
            }
            onEditSuccess()
        }
        catch (err) {
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
                    title: studyTitle,
                    description: study?.internalDescription || '',
                    studyIds: studyId ? [...(analysis?.studyIds || []), studyId ] : analysis.studyIds,
                }}
                validationSchema={getAnalysisValidationSchema(analyses)}
            >
                <Alert warning={true} onDismiss={() => setError('')} message={error} />
                <Col gap='large'>
                    <h3 className='fw-bold'>Analysis Basics</h3>
                    <Title />
                    <Objectives />
                    <SelectedStudies studies={studies} defaultStudy={study} />
                </Col>

                <BottomBar />
            </Form>
        </div>
    )
}

const Title: FC<{}> = () => {
    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <FieldTitle required>Analysis Title</FieldTitle>
                <small>
                    This is an internal title to help you organize your analysis reports. This title is only visible to you
                </small>
            </Col>

            <Col sm={4} direction='column' gap>
                <InputField
                    autoFocus
                    name='title'
                    type='textarea'
                />
                <FieldErrorMessage name='title' liveCountMax={100}/>
            </Col>
        </Box>
    )
}

const Objectives: FC<{}> = () => {
    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <FieldTitle required>Analysis Objectives</FieldTitle>
                <small>
                    Clearly define your objectives for running this analysis with emphasis on the questions you’re hoping to investigate
                </small>
            </Col>

            <Col sm={4} direction='column' gap>
                <InputField
                    autoFocus
                    name='description'
                    type='textarea'
                />
                <FieldErrorMessage name='description' liveCountMax={250}/>
            </Col>
        </Box>
    )
}


const BottomBar: FC<{}> = () => {
    const { isValid, isDirty } = useFormState()

    return (
        <Box className='fixed-bottom bg-white mt-auto' css={{ minHeight: 80, boxShadow: `0px -3px 10px rgba(219, 219, 219, 0.5)` }}>
            <Box className='container-lg' align='center' justify='end'>
                <FormSaveButton
                    data-testid='save-analysis-button'
                    className='btn-researcher-primary'
                    disabled={!isValid || !isDirty}

                >
                    Save & Continue
                </FormSaveButton>

                {/*<ResearcherButton*/}
                {/*    data-testid='save-analysis-button'*/}
                {/*    disabled={!isValid || !isDirty}*/}
                {/*    onClick={() => handleSubmit(() => {})}*/}
                {/*>*/}
                {/*    Save & Continue*/}
                {/*</ResearcherButton>*/}
            </Box>
        </Box>
    )
}
