import { React, cx, useEffect, useState, useHistory } from '@common'
import { NewStudy, Studies, NewStudyCategoryEnum, Study } from '../../api'
import {
    Box, LinkButton, Icon, Alert, Modal, EditingForm as Form, InputField, SelectField, FormHelpers,
} from '@components'
import { useStudyApi, errorToString, formatDate } from '@lib'
import { StudyStatus, getStatus, getStatusName, StudyValidationSchema } from '@models'
import { Row, Col } from '@components'

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
        setError('')
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
                        validationSchema={StudyValidationSchema}
                        initialValues={{
                            titleForParticipants: '',
                            shortDescription: '',
                            longDescription: '',
                            category: NewStudyCategoryEnum.ResearchStudy,
                        }}
                    >
                        <Alert warning={true} onDismiss={() => setError('')} message={error}></Alert>
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

            <Icon height="1.5rem" icon="plusCircle" data-test-id="add-study" onClick={addNewStudy} />
        </React.Fragment>
    )
}

const StudyRow:React.FC<{ study: Study }> = ({ study }) => {
    const history = useHistory()
    return (
        <Row
            css={{
                boxShadow: '0px 0px 4px 2px rgba(0, 0, 0, 0.06)',
                backgroundColor: 'white',
                marginBottom: '1.5rem',
            }}>
            <Col sm={7}>{study.titleForResearchers || study.titleForParticipants}</Col>
            <Col sm={2}>{formatDate(study.opensAt)}</Col>
            <Col sm={2}>{getStatusName(study)}</Col>
            <Col sm={1}><Icon icon="tripleDot" data-test-id="edit-study" onClick={() => history.push(`/studies/${study.id}`)}/></Col>
        </Row>
    )
}

const StudiesTable:React.FC<{ studies: Study[] }> = ({ studies }) => {
    if (!studies.length) return null

    return (
        <div
            data-test-id="studies-table"
            css={{
                '> div': {
                    minHeight: '4rem',
                    alignItems: 'center',
                },
            }}
        >
            <Row css={{ alignItems: 'flex-end' }}>
                <Col sm={7}>NAME</Col>
                <Col sm={2}>OPENED</Col>
                <Col sm={3}>STATUS</Col>
            </Row>
            {studies.map((study) => <StudyRow key={study.id} study={study} />)}
        </div>
    )
}


export function StudiesListing() {
    const api = useStudyApi()
    const [studies, setStudies] = useState<Studies>()
    const fetchStudies = () => {
        api.getStudies().then(setStudies)
    }
    useEffect(fetchStudies, [])
    const [currentStatus, setCurrentStudies] = useState<StudyStatus>(StudyStatus.Active)
    const setStatus = (ev: React.MouseEvent<HTMLAnchorElement>) => setCurrentStudies(ev.currentTarget.dataset.status! as any)
    const displayingStudies = (studies?.data || []).filter(s => getStatus(s) == currentStatus)

    return (
        <div className="container studies mt-8">
            <nav className="navbar fixed-top navbar-light py-1 bg-dark">
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
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a href="#" onClick={setStatus} data-status="Active" className={cx('nav-link', { active: currentStatus == StudyStatus.Active })}>
                        Active
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" onClick={setStatus} data-status="Scheduled" className={cx('nav-link', { active: currentStatus == StudyStatus.Scheduled })}>
                        Scheduled
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" onClick={setStatus} data-status="Completed" className={cx('nav-link', { active: currentStatus == StudyStatus.Completed })}>
                        Completed
                    </a>
                </li>
            </ul>
            <StudiesTable studies={displayingStudies} />
        </div>
    )

}
