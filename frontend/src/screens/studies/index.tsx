import { useEffect, useState } from 'react'
import { React } from '../../common'
import { NewStudy, Studies, NewStudyCategoryEnum, Study } from '../../api'
import {
    Box, LinkButton, Icon, Alert, Modal, EditingForm as Form, InputField, SelectField, FormHelpers,
} from '../../components'
import { useStudyApi, errorToString } from '../../lib'


interface AddModalIconProps {
    onSuccess: () => void
}

const AddModalIcon:React.FC<AddModalIconProps> = ({ onSuccess }) => {
    const api = useStudyApi()
    const [isShowingModal, setShowingModal] = useState(false)
    const [error, setError] = useState('')
    const addNewStudy = () => {
        setShowingModal(true)
    }
    const onHide = () => setShowingModal(false)
    const saveStudy = async (study: NewStudy, helpers: FormHelpers<NewStudy>) => {
        try {
            await api.addStudy({ study })
            helpers.resetForm()
            setShowingModal(false)
            onSuccess()
        }
        catch(err) {
            setError(await errorToString(err))
        }

    }
    return (
        <React.Fragment>
            <Modal title="Add Study" show={isShowingModal} onHide={onHide}>
                <Modal.Body>
                    <Form<NewStudy>
                        onSubmit={saveStudy}
                        showControls
                        onCancel={onHide}
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

            <Icon height="1.5rem" icon="plusCircle" onClick={addNewStudy} />
        </React.Fragment>
    )
}

const StudyRow:React.FC<{ study: Study }> = ({ study }) => {

    return (
        <tr>
            <td>{study.titleForParticipants}</td>
            <td>{study.shortDescription}</td>
        </tr>
    )
}

const StudiesTable:React.FC<{ studies: Study[] }> = ({ studies }) => {
    if (!studies.length) return null

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {studies.map((study) => <StudyRow key={study.id} study={study} />)}
            </tbody>
        </table>
    )
}

export default function AvailableStudies() {
    const api = useStudyApi()
    const [studies, setStudies] = useState<Studies>()
    const fetchStudies = () => {
        api.getStudies().then(setStudies)
    }
    useEffect(fetchStudies, [])

    return (
        <div className="container studies mt-8">
            <nav className="navbar fixed-top navbar-light py-1 bg-light">
                <div className="container-fluid">
                    <LinkButton icon="back" secondary to="/">
                        Home
                    </LinkButton>
                </div>
            </nav>
            <Box align="center" justify="between">
                <h1>studies</h1>
                <AddModalIcon onSuccess={fetchStudies} />
            </Box>
            <StudiesTable studies={studies?.data || []} />
        </div>
    )

}
