import { React, useEffect, useParams, useHistory, useState } from '@common'
import {  StudyUpdate } from '../../api'
import {
    LoadingAnimation, Alert, EditingForm as Form,
    InputField, SelectField, DateField,
} from '@components'
import { StudyValidationSchema } from '@models'
import { useStudyApi, errorToString } from '@lib'

export function StudyDetails() {
    const history = useHistory()
    const api = useStudyApi()
    const [error, setError] = useState('')

    const [ study, setStudy ] = useState<StudyUpdate|null>()
    const { id } = useParams<{ id: string }>()

    const fetchStudy = () => {
        api.getStudies().then(studies => {
            const study = studies.data?.find(s => s.id == Number(id))
            if (study) { setStudy(study as any as StudyUpdate) }
            else {
                setError('study was not found')
            }
        })
    }
    useEffect(fetchStudy, [id])

    if (!study) {
        return <LoadingAnimation message="Loading study" />
    }

    const saveStudy = async (study: StudyUpdate) => {
        try {
            await api.updateStudy({ id, study })
            study
        }
        catch(err) {
            setError(await errorToString(err))
        }
    }
    const onCancel = () => history.push('/studies')

    return (
        <div>
            <Form<StudyUpdate>
                onSubmit={saveStudy}
                showControls
                onCancel={onCancel}
                initialValues={study}
                validationSchema={StudyValidationSchema}
            >
                <Alert warning={true} onDismiss={() => setError('')} message={error}>on</Alert>
                <InputField name="titleForParticipants" id="participants-title" label="Title for participants" />
                <InputField name="titleForResearchers" id="researchers-title" label="Title for researchers" />
                <SelectField
                    name="category" id="category" label="Category"
                    options={[
                        { label: 'Research Study', value: 'research_study' },
                        { label: 'Cognitive Task', value: 'cognitive_task' },
                        { label: 'Survey', value: 'survey' },
                    ]}
                />
                <DateField name="opensAt" id="opens-at" label="Opens At" />
                <DateField name="closesAt" id="closes-at" label="Closes At" />
                <InputField name="shortDescription" id="short-desc" type="textarea" label="Short description"/>
                <InputField name="longDescription" id="long-desc" type="textarea" label="Long description"/>
            </Form>

        </div>
    )
}
