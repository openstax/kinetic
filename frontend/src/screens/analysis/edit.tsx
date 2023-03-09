import { React, useNavigate, useState, useParams } from '@common'
import {
    Alert, EditingForm as Form, InputField, PageNotFound, Box,
} from '@components'
import { Analysis } from '@api'
import { AnalysisValidationSchema } from '@models'
import { useApi, errorToString } from '@lib'
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
                href={`https://workspaces.kinetic.sandbox.openstax.org/edit/${analysis.id}`}
            >Edit Code</a>
        </Box>
    )
}

export const EditAnalysis: FC<EditAnalysisProps> = ({ listing, onEditSuccess }) => {
    const { analysisId } = useParams<string>();
    const analysis =  (!analysisId || analysisId == 'new') ?
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
                onSubmit={saveAnalysis}
                showControls
                onCancel={onCancel}
                enableReinitialize
                defaultValues={analysis}
                validationSchema={AnalysisValidationSchema}
            >

                <Alert warning={true} onDismiss={() => setError('')} message={error} />
                <EditorInfo analysis={analysis} />
                <InputField autoFocus name="title" label="Title" />
                <InputField name="repositoryUrl" label="Repository URL" />
                <InputField name="description" type="textarea" label="Description" />
                <SelectedStudies />
            </Form>

        </div>
    )
}
