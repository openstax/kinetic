import { React, useNavigate, useState, useParams } from '@common'
import {
    Alert, EditingForm as Form, InputField, PageNotFound,
} from '@components'
import { AnalysisValidationSchema } from '@models'
import { Analysis } from '@api'
import { useApi, errorToString } from '@lib'

interface EditAnalysisProps {
    listing: Array<Analysis>
    onEditSuccess(): void
}

const newAnalysis: Analysis = {
    title: '',
    description: '',
    repositoryUrl: '',
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
                await api.updateAnalysis({ id: analysis.id, updateAnalysis: { analysis: analysis as any } })
            } else {
                const savedAnalysis = await api.addAnalysis({ addAnalysis: { analysis: analysis as any } })
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
                initialValues={analysis}
                validationSchema={AnalysisValidationSchema}
            >
                <Alert warning={true} onDismiss={() => setError('')} message={error} />
                <InputField autoFocus name="title" label="Title" />
                <InputField name="repositoryUrl" label="Repository URL" />
                <InputField name="description" type="textarea" label="Description" />
                {analysis.id && <InputField name="apiKey" label="Api Key" readOnly />}
            </Form>

        </div>
    )
}
