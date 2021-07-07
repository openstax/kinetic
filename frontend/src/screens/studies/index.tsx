import { useEffect, useState } from 'react'
import { React } from '../../common'
import { NewStudy, NewStudyCategoryEnum } from '../../api'
import {
    Icon, Alert, Modal, EditingForm as Form, InputField, SelectField, FormHelpers,
} from '../../components'
import { useStudyApi, errorToString } from '../../lib'


const AddModalIcon = () => {
    const api = useStudyApi()
    const [isShowingModal, setShowingModal] = useState(false)
    const [error, setError] = useState('')
    const addNewStudy = () => {
        setShowingModal(true)
    }

    const saveStudy = async (study: NewStudy, helpers: FormHelpers<NewStudy>) => {
        try {
            await api.addStudy({ study })
            helpers.resetForm()
            setShowingModal(false)
        }
        catch(err) {
            setError(await errorToString(err))
        }

    }
    return (
        <React.Fragment>
            <Modal title="Add Study" show={isShowingModal} onHide={() => setShowingModal(false)}>
                <Modal.Body>
                    <Form<NewStudy>
                        onSubmit={saveStudy}
                        showControls
                        initialValues={{
                            titleForParticipants: '',
                            shortDescription: '',
                            longDescription: '',
                            category: NewStudyCategoryEnum.ResearchStudy,
                        }}
                    >
                        <Alert warning={true} onDismiss={() => setError('')} message={error}>on</Alert>
                        <InputField name="titleForParticipants" id="title" label="Title for participants"/>
                        <SelectField
                            name="category" id="category" label="Category"
                            options={[
                                { label: 'Research Study', value: 'research_study' },
                                { label: 'Cognitive Task', value: 'cognitive_task' },
                                { label: 'Survey', value: 'survey' },
                            ]}
                        />
                        <InputField name="shortDescription" id="short-desc" type="textarea" label="Short description"/>
                        <InputField name="longDescription" id="long-desc" type="textarea" label="Long description"/>
                    </Form>
                </Modal.Body>
            </Modal>

            <Icon icon="plusCircle" onClick={addNewStudy} />
        </React.Fragment>
    )
}

export default function Studies() {
    const api = useStudyApi()

    useEffect(() => {
        api.getStudies().then((s) => {
            console.log(s)
        })
    }, [])


    return (
        <div className="container studies mt-4">
            <h1>studies</h1>
            <AddModalIcon />

        </div>
    )

}
