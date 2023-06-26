import { React, useNavigate, useParams, useState } from '@common'
import {
    Alert,
    Box,
    Col,
    EditingForm as Form,
    FieldErrorMessage,
    FieldTitle,
    InputField,
    PageNotFound,
    ResearcherButton,
} from '@components'
import { Analysis } from '@api'
import { getAnalysisValidationSchema } from '@models'
import { errorToString, useApi, useQueryParam } from '@lib'
import { SelectedStudies } from './selected-studies'

interface EditAnalysisProps {
    listing: Array<Analysis>
    onEditSuccess(): void
}

const newAnalysis: Analysis = {
    title: '',
    description: '',
    repositoryUrl: '',
    studies: [],
}


const EditorInfo: FC<{ analysis: Analysis }> = ({ analysis }) => {
    if (!analysis.id) return null

    return (
        <Box align="center" justify="around">
            <InputField name="apiKey" label="Api Key" readOnly />
            <a
                className="btn btn-primary" target="kinetic-workspaces-editor"
                href={`https://workspaces.kinetic.sandbox.openstax.org/editor/#${analysis.id}`}
            >Edit Code</a>
        </Box>
    )
}

const useAnalysis = () => {

}

export const EditAnalysis: FC<EditAnalysisProps> = ({ listing, onEditSuccess }) => {
    const { analysisId } = useParams<string>();
    const studyId = useQueryParam('studyId') || null

    if (studyId) {

    }

    const analysis = (!analysisId || analysisId == 'new') ?
        newAnalysis : listing.find(a => String(a.id) == analysisId)

    const nav = useNavigate()
    const api = useApi()

    const [error, setError] = useState('')

    const onCancel = () => {
        nav('/analysis')
    }

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
        <div className="container analysis mt-8">
            <Form
                name="analysis"
                onSubmit={saveAnalysis}
                showControls
                onCancel={onCancel}
                enableReinitialize
                defaultValues={{
                    ...analysis,
                }}
                validationSchema={getAnalysisValidationSchema(listing)}
            >
                <Alert warning={true} onDismiss={() => setError('')} message={error} />
                <h3 className='fw-bold'>Analysis Basics</h3>
                <Title />


                {/*<EditorInfo analysis={analysis} />*/}
                <InputField name="repositoryUrl" label="Repository URL" />
                <InputField name="description" type="textarea" label="Description" />
                <SelectedStudies />

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

const Description: FC<{}> = () => {
    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <FieldTitle required>Analysis Description</FieldTitle>
                <small>
                    Please provide a brief overview of analysis plan, research methods and analysis methods in description.
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


const BottomBar: FC<{}> = () => {
    return (
        <Box className='fixed-bottom bg-white mt-auto' css={{ minHeight: 80, boxShadow: `0px -3px 10px rgba(219, 219, 219, 0.5)` }}>
            <Box className='container-lg' align='center' justify='end'>
                <ResearcherButton
                    data-testid='save-analysis-button'
                    // disabled={disabled}
                    onClick={() => console.log('submit')}
                >
                    Save & Continue
                </ResearcherButton>
            </Box>
        </Box>
    )
}
